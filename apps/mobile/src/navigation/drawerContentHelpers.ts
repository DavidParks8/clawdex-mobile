import type { ChatSummary } from '../api/types';
import { DEFAULT_WORKSPACE_CHAT_LIMIT, type WorkspaceChatLimit } from '../appSettings';
import type { ChatWorkspaceSection } from './chatThreadTree';

export function sortChats(chats: ChatSummary[]): ChatSummary[] {
  return [...chats].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function dedupeChatsById(chats: ChatSummary[]): ChatSummary[] {
  const byId = new Map<string, ChatSummary>();
  for (const chat of chats) {
    const existing = byId.get(chat.id);
    if (!existing || chat.updatedAt.localeCompare(existing.updatedAt) > 0) {
      byId.set(chat.id, chat);
    }
  }
  return Array.from(byId.values());
}

export function mergeDrawerChatBatch(
  previous: ChatSummary[],
  incoming: ChatSummary[]
): ChatSummary[] {
  if (previous.length === 0) return sortChats(incoming);
  const byId = new Map(previous.map((chat) => [chat.id, chat]));
  for (const chat of incoming) byId.set(chat.id, chat);
  return sortChats(Array.from(byId.values()));
}

function createChatBranchSortEntry(
  rows: ChatWorkspaceSection['data'],
  pinnedOrder: Map<string, number>,
  index: number
) {
  return {
    rows,
    pinnedOrder: rows.reduce(
      (bestOrder, row) => Math.min(
        bestOrder,
        pinnedOrder.get(row.chat.id) ?? Number.MAX_SAFE_INTEGER
      ),
      Number.MAX_SAFE_INTEGER
    ),
    firstUpdatedAt: rows[0]?.chat.updatedAt ?? '',
    index,
  };
}

function sortPinnedChatBranches(
  rows: ChatWorkspaceSection['data'],
  pinnedIds: string[]
): ChatWorkspaceSection['data'] {
  if (rows.length <= 1 || pinnedIds.length === 0) return rows;
  const pinnedOrder = new Map(pinnedIds.map((id, index) => [id, index]));
  const branches: ReturnType<typeof createChatBranchSortEntry>[] = [];
  let currentBranch: ChatWorkspaceSection['data'] = [];
  for (const row of rows) {
    if (row.indentLevel === 0 && currentBranch.length > 0) {
      branches.push(createChatBranchSortEntry(currentBranch, pinnedOrder, branches.length));
      currentBranch = [];
    }
    currentBranch.push(row);
  }
  if (currentBranch.length > 0) {
    branches.push(createChatBranchSortEntry(currentBranch, pinnedOrder, branches.length));
  }
  if (!branches.some((branch) => branch.pinnedOrder !== Number.MAX_SAFE_INTEGER)) return rows;
  return branches.sort((left, right) => {
    if (left.pinnedOrder !== right.pinnedOrder) return left.pinnedOrder - right.pinnedOrder;
    if (left.pinnedOrder !== Number.MAX_SAFE_INTEGER) {
      const updatedDiff = right.firstUpdatedAt.localeCompare(left.firstUpdatedAt);
      if (updatedDiff !== 0) return updatedDiff;
    }
    return left.index - right.index;
  }).flatMap((branch) => branch.rows);
}

export function sortPinnedChatsInSections(
  sections: ChatWorkspaceSection[],
  pinnedIds: string[]
): ChatWorkspaceSection[] {
  if (sections.length === 0 || pinnedIds.length === 0) return sections;
  return sections.map((section) => ({
    ...section,
    data: sortPinnedChatBranches(section.data, pinnedIds),
  }));
}

export function sortWorkspaceSections(
  sections: ChatWorkspaceSection[],
  pinnedWorkspacePaths: string[]
): ChatWorkspaceSection[] {
  if (sections.length <= 1 || pinnedWorkspacePaths.length === 0) return sections;
  const pinnedOrder = new Map(pinnedWorkspacePaths.map((path, index) => [path, index]));
  return [...sections].sort((left, right) => {
    const leftOrder = pinnedOrder.get(left.key) ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = pinnedOrder.get(right.key) ?? Number.MAX_SAFE_INTEGER;
    if (leftOrder !== rightOrder) return leftOrder - rightOrder;
    return leftOrder !== Number.MAX_SAFE_INTEGER
      ? left.title.localeCompare(right.title)
      : 0;
  });
}

export function areDrawerChatListsEquivalent(
  previous: ChatSummary[],
  next: ChatSummary[]
): boolean {
  if (previous === next) return true;
  if (previous.length !== next.length) return false;
  return previous.every((left, index) => {
    const right = next[index];
    return left.id === right.id && left.title === right.title &&
      left.status === right.status && left.updatedAt === right.updatedAt &&
      left.lastMessagePreview === right.lastMessagePreview && left.cwd === right.cwd &&
      left.agentId === right.agentId && left.sourceKind === right.sourceKind &&
      left.parentThreadId === right.parentThreadId && left.subAgentDepth === right.subAgentDepth &&
      left.lastError === right.lastError;
  });
}

export function getDefaultCollapsedWorkspaceKeys(
  sections: ChatWorkspaceSection[]
): Set<string> {
  return new Set(sections.slice(1).map((section) => section.key));
}

export function relativeTime(iso: string): string {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(days / 7);
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  if (weeks < 5) return `${weeks}w`;
  return `${Math.floor(days / 30)}mo`;
}

export function getDrawerChatSubtitle(chat: ChatSummary): string | null {
  const error = chat.lastError?.trim();
  if (error) return error;
  const preview = chat.lastMessagePreview?.trim();
  const title = chat.title?.trim();
  return preview && preview !== title ? preview : null;
}

export function formatCompactCount(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1).replace(/\.0$/, '')}k`;
  }
  return String(value);
}

export function normalizeWorkspaceChatLimit(value: WorkspaceChatLimit): WorkspaceChatLimit {
  return value === 10 || value === 25 || value === null
    ? value
    : DEFAULT_WORKSPACE_CHAT_LIMIT;
}