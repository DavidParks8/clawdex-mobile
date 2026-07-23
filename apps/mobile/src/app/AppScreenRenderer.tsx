import { useMemo } from 'react';

import type { Chat } from '../api/types';
import type { AppStateStore, AppStateSnapshot } from '../appState';
import type { BridgeProfileStore } from '../bridgeProfiles';
import { env } from '../config';
import { BrowserScreen, type BrowserScreenHandle } from '../screens/BrowserScreen';
import { GitScreen } from '../screens/GitScreen';
import { MainScreen, type MainScreenHandle } from '../screens/MainScreen';
import { PrivacyScreen } from '../screens/PrivacyScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { TermsScreen } from '../screens/TermsScreen';
import type { HostBridgeApiClient } from '../api/client';
import type { HostBridgeWsClient } from '../api/ws';
import type { AppScreen, Screen } from './appConstants';

interface AppScreenRendererProps {
  currentScreen: Screen;
  activeApi: HostBridgeApiClient;
  activeWs: HostBridgeWsClient;
  appStateStore: AppStateStore;
  appStateSnapshot: AppStateSnapshot;
  pushSettings: AppStateSnapshot['data']['push'];
  bridgeProfiles: BridgeProfileStore['profiles'];
  activeBridgeProfile: BridgeProfileStore['profiles'][number] | null;
  bridgeUrl: string;
  bridgeToken: string | null;
  browserRef: React.RefObject<BrowserScreenHandle | null>;
  mainRef: React.RefObject<MainScreenHandle | null>;
  gitChat: Chat | null;
  selectedChatId: string | null;
  pendingMainChatId: string | null;
  pendingMainChatSnapshot: Chat | null;
  pendingBrowserTargetUrl: string | null;
  browserReturnScreen: AppScreen;
  approvalMode: AppStateSnapshot['data']['settings']['approvalMode'];
  showToolCalls: boolean;
  workspaceChatLimit: AppStateSnapshot['data']['settings']['workspaceChatLimit'];
  defaultStartCwd: string | null;
  preferredAgentId: string | null;
  agentSettings: AppStateSnapshot['data']['settings']['agentSettings'];
  appearancePreference: AppStateSnapshot['data']['settings']['appearancePreference'];
  darkUiPalette: AppStateSnapshot['data']['settings']['darkUiPalette'];
  fontPreference: AppStateSnapshot['data']['settings']['fontPreference'];
  recentBrowserTargetUrls: string[];
  onOpenDrawer: () => void;
  onOpenGit: (chat: Chat) => void;
  onOpenLocalPreview: (targetUrl?: string | null) => void;
  onOpenBridgeRecoveryGuide: () => void;
  onLastUsedThreadSettingsChange: (agentId: string, collaborationMode: 'default' | 'plan') => void;
  onChatContextChange: (chat: Chat | null) => void;
  onChatOpeningStateChange: React.Dispatch<React.SetStateAction<string | null>>;
  onPendingOpenChatHandled: () => void;
  onApprovalModeChange: (value: AppStateSnapshot['data']['settings']['approvalMode']) => void;
  onShowToolCallsChange: (value: boolean) => void;
  onWorkspaceChatLimitChange: (value: AppStateSnapshot['data']['settings']['workspaceChatLimit']) => void;
  onAppearancePreferenceChange: (value: AppStateSnapshot['data']['settings']['appearancePreference']) => void;
  onDarkUiPaletteChange: (value: AppStateSnapshot['data']['settings']['darkUiPalette']) => void;
  onFontPreferenceChange: (value: AppStateSnapshot['data']['settings']['fontPreference']) => void;
  onRetryPersistence: () => Promise<void>;
  onEditBridgeProfile: () => void;
  onAddBridgeProfile: () => void;
  onSwitchBridgeProfile: (profileId: string) => Promise<void>;
  onRenameBridgeProfile: (profileId: string, nextName: string) => Promise<void>;
  onDeleteBridgeProfile: (profileId: string) => Promise<void>;
  onClearSavedBridges: () => Promise<void>;
  onDrawerGestureEnabledChange: (enabled: boolean) => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onRecentTargetUrlsChange: (value: string[]) => void;
  onPendingTargetHandled: () => void;
  onCloseGit: () => void;
  onGitChatUpdated: (chat: Chat) => void;
}

export function AppScreenRenderer(props: AppScreenRendererProps) {
  const {
    currentScreen,
    activeApi,
    activeWs,
    appStateStore,
    appStateSnapshot,
    pushSettings,
    bridgeProfiles,
    activeBridgeProfile,
    bridgeUrl,
    bridgeToken,
    browserRef,
    mainRef,
    gitChat,
    pendingMainChatId,
    pendingMainChatSnapshot,
    pendingBrowserTargetUrl,
    approvalMode,
    showToolCalls,
    workspaceChatLimit,
    defaultStartCwd,
    preferredAgentId,
    agentSettings,
    appearancePreference,
    darkUiPalette,
    fontPreference,
    recentBrowserTargetUrls,
    onOpenDrawer,
    onOpenGit,
    onOpenLocalPreview,
    onOpenBridgeRecoveryGuide,
    onLastUsedThreadSettingsChange,
    onChatContextChange,
    onChatOpeningStateChange,
    onPendingOpenChatHandled,
    onApprovalModeChange,
    onShowToolCallsChange,
    onWorkspaceChatLimitChange,
    onAppearancePreferenceChange,
    onDarkUiPaletteChange,
    onFontPreferenceChange,
    onRetryPersistence,
    onEditBridgeProfile,
    onAddBridgeProfile,
    onSwitchBridgeProfile,
    onRenameBridgeProfile,
    onDeleteBridgeProfile,
    onClearSavedBridges,
    onDrawerGestureEnabledChange,
    onOpenPrivacy,
    onOpenTerms,
    onRecentTargetUrlsChange,
    onPendingTargetHandled,
    onCloseGit,
    onGitChatUpdated,
  } = props;

  const mainScreen = useMemo(
    () => (
      <MainScreen
        key={activeBridgeProfile?.id}
        ref={mainRef}
        api={activeApi}
        ws={activeWs}
        bridgeUrl={bridgeUrl}
        bridgeToken={bridgeToken}
        bridgeProfileId={activeBridgeProfile?.id ?? ''}
        onOpenDrawer={onOpenDrawer}
        onOpenGit={onOpenGit}
        onOpenLocalPreview={onOpenLocalPreview}
        onOpenBridgeRecoveryGuide={onOpenBridgeRecoveryGuide}
        defaultStartCwd={defaultStartCwd}
        preferredAgentId={preferredAgentId}
        agentSettings={agentSettings}
        onLastUsedThreadSettingsChange={onLastUsedThreadSettingsChange}
        approvalMode={approvalMode}
        showToolCalls={showToolCalls}
        onDefaultStartCwdChange={(value) => appStateStore.dispatch({ type: 'settings/update', patch: { defaultStartCwd: value } })}
        onChatContextChange={onChatContextChange}
        onChatOpeningStateChange={onChatOpeningStateChange}
        pendingOpenChatId={pendingMainChatId}
        pendingOpenChatSnapshot={pendingMainChatSnapshot}
        onPendingOpenChatHandled={onPendingOpenChatHandled}
      />
    ),
    [
      activeApi,
      activeBridgeProfile?.id,
      activeWs,
      agentSettings,
      appStateStore,
      approvalMode,
      bridgeToken,
      bridgeUrl,
      defaultStartCwd,
      mainRef,
      onChatContextChange,
      onChatOpeningStateChange,
      onLastUsedThreadSettingsChange,
      onOpenBridgeRecoveryGuide,
      onOpenDrawer,
      onOpenGit,
      onOpenLocalPreview,
      onPendingOpenChatHandled,
      pendingMainChatId,
      pendingMainChatSnapshot,
      preferredAgentId,
      showToolCalls,
    ]
  );

  switch (currentScreen) {
    case 'ChatGit':
      return gitChat ? (
        <GitScreen
          api={activeApi}
          chat={gitChat}
          approvalMode={approvalMode}
          onBack={onCloseGit}
          onChatUpdated={onGitChatUpdated}
        />
      ) : (
        mainScreen
      );
    case 'Settings':
      return (
        <SettingsScreen
          api={activeApi}
          ws={activeWs}
          appStateStore={appStateStore}
          pushSettings={pushSettings}
          activeBridgeProfileId={activeBridgeProfile?.id ?? null}
          bridgeProfileName={activeBridgeProfile?.name ?? 'Current bridge'}
          bridgeProfiles={bridgeProfiles}
          approvalMode={approvalMode}
          onApprovalModeChange={onApprovalModeChange}
          showToolCalls={showToolCalls}
          onShowToolCallsChange={onShowToolCallsChange}
          workspaceChatLimit={workspaceChatLimit}
          onWorkspaceChatLimitChange={onWorkspaceChatLimitChange}
          appearancePreference={appearancePreference}
          darkUiPalette={darkUiPalette}
          onAppearancePreferenceChange={onAppearancePreferenceChange}
          onDarkUiPaletteChange={onDarkUiPaletteChange}
          fontPreference={fontPreference}
          onFontPreferenceChange={onFontPreferenceChange}
          persistenceError={appStateSnapshot.persistenceError}
          onRetryPersistence={onRetryPersistence}
          onEditBridgeProfile={onEditBridgeProfile}
          onAddBridgeProfile={onAddBridgeProfile}
          onSwitchBridgeProfile={onSwitchBridgeProfile}
          onRenameBridgeProfile={onRenameBridgeProfile}
          onDeleteBridgeProfile={onDeleteBridgeProfile}
          onClearSavedBridges={onClearSavedBridges}
          onOpenDrawer={onOpenDrawer}
          onDrawerGestureEnabledChange={onDrawerGestureEnabledChange}
          onOpenPrivacy={onOpenPrivacy}
          onOpenTerms={onOpenTerms}
        />
      );
    case 'Browser':
      return (
        <BrowserScreen
          ref={browserRef}
          api={activeApi}
          bridgeUrl={bridgeUrl}
          onOpenDrawer={onOpenDrawer}
          recentTargetUrls={recentBrowserTargetUrls}
          onRecentTargetUrlsChange={onRecentTargetUrlsChange}
          pendingTargetUrl={pendingBrowserTargetUrl}
          onPendingTargetHandled={onPendingTargetHandled}
        />
      );
    case 'Privacy':
      return <PrivacyScreen policyUrl={env.privacyPolicyUrl} onOpenDrawer={onOpenDrawer} />;
    case 'Terms':
      return <TermsScreen termsUrl={env.termsOfServiceUrl} onOpenDrawer={onOpenDrawer} />;
    default:
      return mainScreen;
  }
}