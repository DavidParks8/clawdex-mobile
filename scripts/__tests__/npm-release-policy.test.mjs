import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { resolveNpmRelease } from '../resolve-npm-release.mjs';
import { resolveNpmPublishTarget } from '../resolve-npm-publish-target.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const packageJson = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
const packageIdentity = { packageName: packageJson.name, packageVersion: packageJson.version };

test('only the matching version tag owns automatic publishing', () => {
  const release = resolveNpmRelease({
    ...packageIdentity,
    eventName: 'push',
    ref: `refs/tags/v${packageIdentity.packageVersion}`,
    manualPublish: 'false',
    releaseCommitOnMain: true,
  });
  assert.equal(release.publishAllowed, true);
  assert.equal(release.owner, 'version-tag');

  const branch = resolveNpmRelease({
    ...packageIdentity,
    eventName: 'push',
    ref: 'refs/heads/main',
    manualPublish: 'false',
  });
  assert.equal(branch.publishAllowed, false);
  assert.equal(branch.owner, 'build-only');
});

test('a mismatched version tag fails before release builds', () => {
  assert.throws(
    () => resolveNpmRelease({
      ...packageIdentity,
      eventName: 'push',
      ref: `refs/tags/v${packageIdentity.packageVersion}-mismatch`,
      manualPublish: 'false',
    }),
    new RegExp(`expected refs/tags/v${packageIdentity.packageVersion.replaceAll('.', '\\.')}`)
  );
});

test('a release tag must point to a commit on main', () => {
  assert.throws(
    () => resolveNpmRelease({
      ...packageIdentity,
      eventName: 'push',
      ref: `refs/tags/v${packageIdentity.packageVersion}`,
      manualPublish: 'false',
      releaseCommitOnMain: false,
    }),
    /reachable from origin\/main/
  );
});

test('manual publishing requires the explicit publish request', () => {
  for (const manualPublish of ['false', '']) {
    const release = resolveNpmRelease({
      ...packageIdentity,
      eventName: 'workflow_dispatch',
      ref: 'refs/heads/main',
      manualPublish,
    });
    assert.equal(release.publishAllowed, false);
  }

  const release = resolveNpmRelease({
    ...packageIdentity,
    eventName: 'workflow_dispatch',
    ref: 'refs/heads/main',
    manualPublish: 'true',
  });
  assert.equal(release.publishAllowed, true);
  assert.equal(release.owner, 'approved-manual');

  for (const ref of ['refs/heads/unreviewed', `refs/tags/v${packageIdentity.packageVersion}`]) {
    assert.throws(
      () => resolveNpmRelease({
        ...packageIdentity,
        eventName: 'workflow_dispatch',
        ref,
        manualPublish: 'true',
      }),
      /only allowed from refs\/heads\/main/
    );
  }
});

test('npm publish targets reserve latest for stable versions', () => {
  const cases = [
    { version: '6.0.0', requestedTag: '', publishTag: 'latest', isPrerelease: false },
    { version: '6.0.0', requestedTag: 'beta', publishTag: 'beta', isPrerelease: false },
    { version: '6.0.0-beta.1', requestedTag: '', publishTag: 'beta', isPrerelease: true },
    { version: '6.0.0-0', requestedTag: 'auto', publishTag: 'next', isPrerelease: true },
    { version: '6.0.0-v1.0', requestedTag: '', publishTag: 'next', isPrerelease: true },
    { version: '6.0.0-beta.1', requestedTag: 'preview', publishTag: 'preview', isPrerelease: true },
  ];
  for (const expected of cases) {
    const target = resolveNpmPublishTarget({
      packageName: packageIdentity.packageName,
      packageVersion: expected.version,
      requestedTag: expected.requestedTag,
    });
    assert.equal(target.publishTag, expected.publishTag, expected.version);
    assert.equal(target.isPrerelease, expected.isPrerelease, expected.version);
  }

  assert.throws(
    () => resolveNpmPublishTarget({
      packageName: packageIdentity.packageName,
      packageVersion: '6.0.0-beta.1',
      requestedTag: 'latest',
    }),
    /cannot use the npm latest/
  );
  for (const requestedTag of ['0', 'v1', '$(unsafe)', 'bad tag']) {
    assert.throws(
      () => resolveNpmPublishTarget({
        packageName: packageIdentity.packageName,
        packageVersion: '6.0.0',
        requestedTag,
      }),
      /npm dist-tag|Invalid npm dist-tag/
    );
  }
});

test('release workflow syntax and ownership policy validate', () => {
  const result = spawnSync(process.execPath, ['scripts/validate-npm-release-workflow.mjs'], {
    cwd: root,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /single-owner/);
});
