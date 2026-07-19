import { appendFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import semver from 'semver';

function validateDistTag(tag) {
  if (!/^[A-Za-z][0-9A-Za-z._-]*$/.test(tag)) {
    throw new Error(`Invalid npm dist-tag: ${tag}`);
  }
  if (semver.validRange(tag) !== null) {
    throw new Error(`npm dist-tag must not be a valid SemVer range: ${tag}`);
  }
}

export function resolveNpmPublishTarget({ packageName, packageVersion, requestedTag = '' }) {
  if (!packageName || !packageVersion) {
    throw new Error('package.json must include name and version');
  }
  const parsedVersion = semver.parse(packageVersion);
  if (!parsedVersion || parsedVersion.raw !== packageVersion) {
    throw new Error(`Invalid package version: ${packageVersion}`);
  }

  const isPrerelease = parsedVersion.prerelease.length > 0;
  let publishTag;
  if (requestedTag && requestedTag !== 'auto') {
    publishTag = requestedTag;
  } else if (isPrerelease) {
    const inferredTag = parsedVersion.prerelease[0];
    publishTag = typeof inferredTag === 'string' ? inferredTag : 'next';
    try {
      validateDistTag(publishTag);
    } catch {
      publishTag = 'next';
    }
  } else {
    publishTag = 'latest';
  }

  validateDistTag(publishTag);
  if (isPrerelease && publishTag === 'latest') {
    throw new Error('Prerelease versions cannot use the npm latest dist-tag');
  }

  return { packageName, packageVersion, publishTag, isPrerelease };
}

function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const packageJson = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
  const target = resolveNpmPublishTarget({
    packageName: packageJson.name,
    packageVersion: packageJson.version,
    requestedTag: process.env.WORKFLOW_NPM_TAG ?? '',
  });
  const output = [
    `package_name=${target.packageName}`,
    `package_version=${target.packageVersion}`,
    `publish_tag=${target.publishTag}`,
    `is_prerelease=${String(target.isPrerelease)}`,
  ].join('\n');

  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `${output}\n`);
  } else {
    process.stdout.write(`${output}\n`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
