import { useCallback, type Dispatch, type SetStateAction } from 'react';

import { deleteChatSnapshotCache, loadChatSnapshotCache, type ChatSnapshotCache } from '../chatSnapshotCache';
import type { Chat } from '../api/types';
import type { AppStateStore } from '../appState';
import { type BridgeProfileDraft, type BridgeProfileStore } from '../bridgeProfiles';
import { normalizeBridgeUrlInput } from '../bridgeUrl';
import type { OnboardingBridgeProfileDraft, OnboardingMode } from '../screens/OnboardingScreen';
import { normalizeBridgeToken } from './appDrawerUtils';
import type { AppScreen, Screen } from './appConstants';

interface UseAppProfileActionsArgs {
  appStateStore: AppStateStore;
  activeBridgeProfile: BridgeProfileStore['profiles'][number] | null;
  activeBridgeProfileId: string | null;
  currentBridgeProfileStore: BridgeProfileStore;
  bridgeProfiles: BridgeProfileStore['profiles'];
  bridgeUrl: string | null;
  currentScreen: Screen;
  onboardingMode: OnboardingMode;
  onboardingReturnScreen: AppScreen;
  setCurrentScreen: Dispatch<SetStateAction<Screen>>;
  setOnboardingMode: Dispatch<SetStateAction<OnboardingMode>>;
  setOnboardingReturnScreen: Dispatch<SetStateAction<AppScreen>>;
  setSelectedChatId: Dispatch<SetStateAction<string | null>>;
  setActiveChat: Dispatch<SetStateAction<Chat | null>>;
  setGitChat: Dispatch<SetStateAction<Chat | null>>;
  setChatTransitionChatId: Dispatch<SetStateAction<string | null>>;
  setMainOpeningChatId: Dispatch<SetStateAction<string | null>>;
  setPendingMainChatId: Dispatch<SetStateAction<string | null>>;
  setPendingMainChatSnapshot: Dispatch<SetStateAction<Chat | null>>;
  setChatSnapshotCache: Dispatch<SetStateAction<ChatSnapshotCache | null>>;
  closeDrawer: () => void;
}

export function useAppProfileActions({
  appStateStore,
  activeBridgeProfile,
  activeBridgeProfileId,
  currentBridgeProfileStore,
  bridgeProfiles,
  bridgeUrl,
  currentScreen,
  onboardingMode,
  onboardingReturnScreen,
  setCurrentScreen,
  setOnboardingMode,
  setOnboardingReturnScreen,
  setSelectedChatId,
  setActiveChat,
  setGitChat,
  setChatTransitionChatId,
  setMainOpeningChatId,
  setPendingMainChatId,
  setPendingMainChatSnapshot,
  setChatSnapshotCache,
  closeDrawer,
}: UseAppProfileActionsArgs) {
  const resetBridgeSessionState = useCallback(() => {
    setSelectedChatId(null);
    setActiveChat(null);
    setGitChat(null);
    setChatTransitionChatId(null);
    setMainOpeningChatId(null);
    setPendingMainChatId(null);
    setPendingMainChatSnapshot(null);
    setChatSnapshotCache(null);
  }, [
    setActiveChat,
    setChatSnapshotCache,
    setChatTransitionChatId,
    setGitChat,
    setMainOpeningChatId,
    setPendingMainChatId,
    setPendingMainChatSnapshot,
    setSelectedChatId,
  ]);

  const handleBridgeProfileSaved = useCallback(
    async (draft: OnboardingBridgeProfileDraft) => {
      const normalized = normalizeBridgeUrlInput(draft.bridgeUrl);
      const normalizedToken = normalizeBridgeToken(draft.bridgeToken);
      if (!normalized || !normalizedToken) {
        throw new Error('Bridge URL and token are required.');
      }

      const nextDraft: BridgeProfileDraft = {
        id: onboardingMode === 'edit' ? activeBridgeProfile?.id ?? null : null,
        bridgeUrl: normalized,
        bridgeToken: normalizedToken,
        activate: true,
      };
      const editedProfile = nextDraft.id
        ? currentBridgeProfileStore.profiles.find((profile) => profile.id === nextDraft.id) ?? null
        : null;
      const bridgeIdentityChanged = Boolean(
        editedProfile &&
          (editedProfile.bridgeUrl !== normalized || editedProfile.bridgeToken !== normalizedToken)
      );
      const nextState = await appStateStore.dispatchDurable({
        type: 'profiles/save',
        draft: nextDraft,
      });
      const nextStore = nextState.bridgeProfiles;
      if (bridgeIdentityChanged && nextStore.activeProfileId) {
        await deleteChatSnapshotCache(nextStore.activeProfileId);
      }

      resetBridgeSessionState();
      const nextCache =
        nextStore.activeProfileId && !bridgeIdentityChanged
          ? await loadChatSnapshotCache(nextStore.activeProfileId)
          : null;
      const selectedSnapshot =
        nextCache?.entries.find((entry) => entry.chat.id === nextCache.selectedChatId)?.chat ?? null;
      setChatSnapshotCache(nextCache);
      setSelectedChatId(selectedSnapshot?.id ?? null);
      setActiveChat(selectedSnapshot);
      setPendingMainChatId(selectedSnapshot?.id ?? null);
      setPendingMainChatSnapshot(selectedSnapshot);
      setCurrentScreen(onboardingMode === 'initial' ? 'Main' : onboardingReturnScreen);
      setOnboardingMode('edit');
      closeDrawer();
    },
    [
      activeBridgeProfile?.id,
      appStateStore,
      closeDrawer,
      currentBridgeProfileStore,
      onboardingMode,
      onboardingReturnScreen,
      resetBridgeSessionState,
      setActiveChat,
      setChatSnapshotCache,
      setCurrentScreen,
      setOnboardingMode,
      setPendingMainChatId,
      setPendingMainChatSnapshot,
      setSelectedChatId,
    ]
  );

  const handleEditBridgeProfile = useCallback(() => {
    setOnboardingMode(bridgeUrl ? 'edit' : 'initial');
    setOnboardingReturnScreen(currentScreen === 'Onboarding' ? 'Settings' : currentScreen);
    setCurrentScreen('Onboarding');
    closeDrawer();
  }, [bridgeUrl, closeDrawer, currentScreen, setCurrentScreen, setOnboardingMode, setOnboardingReturnScreen]);

  const handleAddBridgeProfile = useCallback(() => {
    setOnboardingMode('add');
    setOnboardingReturnScreen(currentScreen === 'Onboarding' ? 'Settings' : currentScreen);
    setCurrentScreen('Onboarding');
    closeDrawer();
  }, [closeDrawer, currentScreen, setCurrentScreen, setOnboardingMode, setOnboardingReturnScreen]);

  const handleOpenBridgeRecoveryGuide = useCallback(() => {
    setOnboardingMode('reconnect');
    setOnboardingReturnScreen(currentScreen === 'Onboarding' ? 'Settings' : currentScreen);
    setCurrentScreen('Onboarding');
    closeDrawer();
  }, [closeDrawer, currentScreen, setCurrentScreen, setOnboardingMode, setOnboardingReturnScreen]);

  const handleSwitchBridgeProfile = useCallback(
    async (profileId: string) => {
      const nextCache = await loadChatSnapshotCache(profileId);
      await appStateStore.dispatchDurable({ type: 'profiles/switch', profileId });
      const selectedSnapshot =
        nextCache.entries.find((entry) => entry.chat.id === nextCache.selectedChatId)?.chat ?? null;
      resetBridgeSessionState();
      setChatSnapshotCache(nextCache);
      setSelectedChatId(selectedSnapshot?.id ?? null);
      setActiveChat(selectedSnapshot);
      setPendingMainChatId(selectedSnapshot?.id ?? null);
      setPendingMainChatSnapshot(selectedSnapshot);
    },
    [
      appStateStore,
      resetBridgeSessionState,
      setActiveChat,
      setChatSnapshotCache,
      setPendingMainChatId,
      setPendingMainChatSnapshot,
      setSelectedChatId,
    ]
  );

  const handleRenameBridgeProfile = useCallback(
    async (profileId: string, nextName: string) => {
      await appStateStore.dispatchDurable({ type: 'profiles/rename', profileId, name: nextName });
    },
    [appStateStore]
  );

  const handleDeleteBridgeProfile = useCallback(
    async (profileId: string) => {
      const deletingActiveProfile = activeBridgeProfileId === profileId;
      const nextState = await appStateStore.dispatchDurable({ type: 'profiles/remove', profileId });
      const nextStore = nextState.bridgeProfiles;
      await deleteChatSnapshotCache(profileId);

      if (deletingActiveProfile) {
        resetBridgeSessionState();
        const nextCache = nextStore.activeProfileId
          ? await loadChatSnapshotCache(nextStore.activeProfileId)
          : null;
        const selectedSnapshot =
          nextCache?.entries.find((entry) => entry.chat.id === nextCache.selectedChatId)?.chat ?? null;
        setChatSnapshotCache(nextCache);
        setSelectedChatId(selectedSnapshot?.id ?? null);
        setActiveChat(selectedSnapshot);
        setPendingMainChatId(selectedSnapshot?.id ?? null);
        setPendingMainChatSnapshot(selectedSnapshot);
      }

      if (nextStore.profiles.length === 0) {
        setOnboardingMode('initial');
        setOnboardingReturnScreen('Main');
        setCurrentScreen('Onboarding');
        closeDrawer();
      }
    },
    [
      activeBridgeProfileId,
      appStateStore,
      closeDrawer,
      resetBridgeSessionState,
      setActiveChat,
      setChatSnapshotCache,
      setCurrentScreen,
      setOnboardingMode,
      setOnboardingReturnScreen,
      setPendingMainChatId,
      setPendingMainChatSnapshot,
      setSelectedChatId,
    ]
  );

  const handleClearSavedBridges = useCallback(async () => {
    await appStateStore.dispatchDurable({ type: 'profiles/clear' });
    await Promise.all(bridgeProfiles.map((profile) => deleteChatSnapshotCache(profile.id)));
    resetBridgeSessionState();
    setOnboardingMode('initial');
    setOnboardingReturnScreen('Main');
    setCurrentScreen('Onboarding');
    closeDrawer();
  }, [
    appStateStore,
    bridgeProfiles,
    closeDrawer,
    resetBridgeSessionState,
    setCurrentScreen,
    setOnboardingMode,
    setOnboardingReturnScreen,
  ]);

  const handleCancelOnboarding = useCallback(() => {
    setCurrentScreen(onboardingReturnScreen);
  }, [onboardingReturnScreen, setCurrentScreen]);

  return {
    resetBridgeSessionState,
    handleBridgeProfileSaved,
    handleEditBridgeProfile,
    handleAddBridgeProfile,
    handleOpenBridgeRecoveryGuide,
    handleSwitchBridgeProfile,
    handleRenameBridgeProfile,
    handleDeleteBridgeProfile,
    handleClearSavedBridges,
    handleCancelOnboarding,
  };
}
