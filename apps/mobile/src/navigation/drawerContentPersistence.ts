import * as FileSystem from 'expo-file-system/legacy';

const PINNED_CHAT_IDS_FILE = 'tethercode-pinned-chats.json';
const PINNED_WORKSPACE_PATHS_FILE = 'tethercode-workspace-favorites.json';
const PINNED_WORKSPACE_PATHS_VERSION = 1;
export const PINNED_WORKSPACE_PATHS_LIMIT = 4;

function toRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null
    ? (value as Record<string, unknown>)
    : null;
}

function documentPath(filename: string): string | null {
  const base = FileSystem.documentDirectory;
  return base ? `${base}${filename}` : null;
}

function parseStringList(raw: string, property: string): string[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    const values = Array.isArray(parsed) ? parsed : toRecord(parsed)?.[property];
    if (!Array.isArray(values)) return [];
    return Array.from(new Set(values
      .filter((value): value is string => typeof value === 'string')
      .map((value) => value.trim())
      .filter(Boolean)));
  } catch {
    return [];
  }
}

export async function loadPinnedChatIds(): Promise<string[]> {
  const path = documentPath(PINNED_CHAT_IDS_FILE);
  if (!path) return [];
  try {
    return parseStringList(await FileSystem.readAsStringAsync(path), 'ids');
  } catch {
    return [];
  }
}

export async function loadPinnedWorkspacePaths(): Promise<string[]> {
  const path = documentPath(PINNED_WORKSPACE_PATHS_FILE);
  if (!path) return [];
  try {
    return parseStringList(await FileSystem.readAsStringAsync(path), 'paths')
      .slice(0, PINNED_WORKSPACE_PATHS_LIMIT);
  } catch {
    return [];
  }
}

export async function persistPinnedChatIds(ids: string[]): Promise<void> {
  const path = documentPath(PINNED_CHAT_IDS_FILE);
  if (!path) return;
  try {
    await FileSystem.writeAsStringAsync(path, JSON.stringify({ ids }));
  } catch {
    // Best effort persistence only.
  }
}

export async function persistPinnedWorkspacePaths(paths: string[]): Promise<void> {
  const path = documentPath(PINNED_WORKSPACE_PATHS_FILE);
  if (!path) return;
  try {
    await FileSystem.writeAsStringAsync(path, JSON.stringify({
      version: PINNED_WORKSPACE_PATHS_VERSION,
      paths,
    }));
  } catch {
    // Best effort persistence only.
  }
}