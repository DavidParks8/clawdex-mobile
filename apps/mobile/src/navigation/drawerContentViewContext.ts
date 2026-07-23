import { createContext, useContext, type Dispatch, type RefObject, type SetStateAction } from 'react';
import type { AgentDescriptor, AgentId, ChatSummary } from '../api/types';
import type { WorkspaceChatLimit } from '../appSettings';
import type { AppTheme } from '../theme';
import type { ChatWorkspaceSection } from './chatThreadTree';
import type { DrawerRunIndicatorMap } from './drawerRuntimeIndicators';
import type { DrawerContentStyles } from './drawerContentStyles';
import type { DrawerScreen } from './drawerContentTypes';

export interface DrawerContentViewModel {
  agents: AgentDescriptor[];
  chatFilterOptions: AgentDescriptor[];
  chats: ChatSummary[];
  chatSections: ChatWorkspaceSection[];
  visibleChatSections: ChatWorkspaceSection[];
  chatSectionByKey: Map<string, ChatWorkspaceSection>;
  collapsedWorkspaceKeys: Set<string>;
  filterMenuVisible: boolean;
  filteredChatCount: number;
  handleNavigate: (screen: DrawerScreen) => void;
  handleNewChat: () => void;
  handleSelectChat: (chatId: string) => void;
  handleToggleFilterMenu: () => void;
  hasActiveFilters: boolean;
  isSearching: boolean;
  loadChats: (showRefresh?: boolean, forceRefresh?: boolean) => Promise<void>;
  loading: boolean;
  loadingOlderChats: boolean;
  normalizedWorkspaceChatLimit: WorkspaceChatLimit;
  partialHistoryDiagnostics: string[];
  pinnedChatIdSet: Set<string>;
  pinnedWorkspacePathSet: Set<string>;
  refreshing: boolean;
  resolvedEmptyHint: string;
  resolvedEmptyTitle: string;
  retryDeepChatListRef: RefObject<() => Promise<void>>;
  runningChatCount: number;
  runIndicatorsByThread: DrawerRunIndicatorMap;
  searchQuery: string;
  selectedAgentIdSet: Set<AgentId>;
  selectedChatId: string | null;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  showAllWorkspaceChats: (section: ChatWorkspaceSection) => void;
  showChatPinAction: (chat: ChatSummary) => void;
  showWorkspacePinAction: (section: ChatWorkspaceSection) => void;
  styles: DrawerContentStyles;
  theme: AppTheme;
  toggleAgentFilter: (agentId: AgentId) => void;
  toggleWorkspaceSection: (sectionKey: string) => void;
  wsConnected: boolean;
}

export const DrawerContentViewContext = createContext<DrawerContentViewModel | null>(null);

export function useDrawerContentViewModel(): DrawerContentViewModel {
  const value = useContext(DrawerContentViewContext);
  if (!value) throw new Error('DrawerContentView requires DrawerContentViewContext');
  return value;
}