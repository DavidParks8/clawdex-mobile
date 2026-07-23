import type { HostBridgeApiClient } from '../api/client';
import type {
  ApprovalMode,
  Chat,
  GitBranchSummary,
  GitDiffResponse,
  GitHistoryCommit,
  GitStatusResponse,
} from '../api/types';
import type { AppTheme } from '../theme';
import type { UnifiedDiffDocument } from './gitDiff';
import type { GitReviewComment, GitReviewTarget } from './gitDiffReview';
import type { ChangedFileEntry } from './gitScreenUtils';

export interface GitScreenProps {
  api: HostBridgeApiClient;
  chat: Chat;
  approvalMode?: ApprovalMode;
  onBack: () => void;
  onChatUpdated?: (chat: Chat) => void;
}

export interface GitChangedFileWithStats extends ChangedFileEntry {
  stats: { additions: number; deletions: number } | null;
  diffFileId: string | null;
}

export interface GitScreenDerivedState {
  hasWorkspace: boolean;
  workspaceChanged: boolean;
  changedFiles: ChangedFileEntry[];
  changedFilesWithStats: GitChangedFileWithStats[];
  parsedDiff: UnifiedDiffDocument;
  truncationNotice: string;
  hasChanges: boolean;
  hasStagedFiles: boolean;
  hasUnstagedFiles: boolean;
  aheadCount: number;
  behindCount: number;
  hasUpstream: boolean;
  upstreamBranch: string | null;
  stagedCount: number;
  unstagedCount: number;
  untrackedCount: number;
  latestCommit: GitHistoryCommit | null;
  canPush: boolean;
  canPublishBranch: boolean;
  showPushAction: boolean;
  commitButtonDisabled: boolean;
  pushButtonDisabled: boolean;
  upstreamDisplay: string | null;
  syncDisplay: string | null;
  reviewTitle: string;
  reviewDetail: string;
  reviewHighlights: GitChangedFileWithStats[];
  pushButtonLabel: string;
  branchSwitchDisabled: boolean;
  branchRows: GitBranchSummary[];
  filesListMaxHeight: number;
  diffViewerMaxHeight: number;
}

export interface GitScreenDataState {
  theme: AppTheme;
  status: GitStatusResponse | null;
  diff: GitDiffResponse | null;
  history: GitHistoryCommit[];
  branches: GitBranchSummary[];
  branchDraft: string;
  branchPanelOpen: boolean;
  commitMessage: string;
  workspaceDraft: string;
  loading: boolean;
  savingWorkspace: boolean;
  committing: boolean;
  pushing: boolean;
  switchingBranch: boolean;
  stagingPath: string | null;
  unstagingPath: string | null;
  stagingAll: boolean;
  unstagingAll: boolean;
  bodyScrollEnabled: boolean;
  error: string | null;
  activeChat: Chat;
  derived: GitScreenDerivedState;
}

export interface GitDiffSelectionState {
  selectedDiffFileId: string | null;
  pendingDiffFileId: string | null;
  switchingDiffFile: boolean;
  activeDiffTabId: string | null;
  selectedDiffFile: UnifiedDiffDocument['files'][number] | null;
  diffFileForView: UnifiedDiffDocument['files'][number] | null;
  showDiffFileSwitching: boolean;
}

export interface GitReviewState {
  reviewComments: GitReviewComment[];
  reviewTarget: GitReviewTarget | null;
  reviewCommentDraft: string;
  submittingReview: boolean;
}