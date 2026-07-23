import { useEffect } from 'react';
import type { Dispatch, MutableRefObject, SetStateAction } from 'react';

import {
  createEmptyChatSnapshotCache,
  loadChatSnapshotCache,
  saveChatSnapshotCache,
  updateChatSnapshotCache,
  type ChatSnapshotCache,
} from '../chatSnapshotCache';
import { bindAppWebSocketLifecycle } from '../appWebSocketLifecycle';
import { syncPushRegistration } from '../pushController';
import { getActiveBridgeProfile } from '../bridgeProfiles';
import { APP_PREFETCH_CHAT_LIMIT, APP_PREFETCH_DELAY_MS, CHAT_SNAPSHOT_PERSIST_DELAY_MS, type Screen } from './appConstants';
import type { Chat } from '../api/types';
import type { HostBridgeApiClient } from '../api/client';
import type { HostBridgeWsClient } from '../api/ws';
import type { AppStateStore } from '../appState';

interface UseAppBridgeLifecycleArgs {
  ws: HostBridgeWsClient | null;
  api: HostBridgeApiClient | null;
  appStateStore: AppStateStore;
  settingsLoaded: boolean;
  currentScreen: Screen;
  activeBridgeProfileId: string | null;
  activeBridgeProfile: ReturnType<typeof getActiveBridgeProfile>;
  setBridgeConnected: Dispatch<SetStateAction<boolean>>;
  setChatSnapshotCache: Dispatch<SetStateAction<ChatSnapshotCache | null>>;
  setSelectedChatId: Dispatch<SetStateAction<string | null>>;
  setActiveChat: Dispatch<SetStateAction<Chat | null>>;
  setPendingMainChatId: Dispatch<SetStateAction<string | null>>;
  setPendingMainChatSnapshot: Dispatch<SetStateAction<Chat | null>>;
  selectedChatId: string | null;
  activeChat: Chat | null;
  chatSnapshotCache: ChatSnapshotCache | null;
  chatSnapshotPersistTimerRef: MutableRefObject<ReturnType<typeof setTimeout> | null>;
}

export function useAppBridgeLifecycle({
  ws,
  api,
  appStateStore,
  settingsLoaded,
  currentScreen,
  activeBridgeProfileId,
  activeBridgeProfile,
  setBridgeConnected,
  setChatSnapshotCache,
  setSelectedChatId,
  setActiveChat,
  setPendingMainChatId,
  setPendingMainChatSnapshot,
  selectedChatId,
  activeChat,
  chatSnapshotCache,
  chatSnapshotPersistTimerRef,
}: UseAppBridgeLifecycleArgs): void {
  useEffect(() => {
    if (!ws) {
      setBridgeConnected(false);
      return;
    }

    return bindAppWebSocketLifecycle(ws);
  }, [setBridgeConnected, ws]);

  useEffect(() => {
    if (!ws) {
      setBridgeConnected(false);
      return;
    }

    setBridgeConnected(ws.isConnected);
    return ws.onStatus((connected) => {
      setBridgeConnected(connected);
    });
  }, [setBridgeConnected, ws]);

  useEffect(() => {
    if (!api || !ws || !activeBridgeProfileId || currentScreen === 'Onboarding') {
      return;
    }
    let cancelled = false;
    let inFlight = false;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let retryDelay = 1000;
    const attempt = () => {
      if (cancelled || inFlight || !ws.isConnected) return;
      inFlight = true;
      void syncPushRegistration(api, appStateStore, activeBridgeProfileId)
        .then(() => {
          retryDelay = 1000;
        })
        .catch(() => {
          if (!cancelled) {
            retryTimer = setTimeout(attempt, retryDelay);
            retryDelay = Math.min(retryDelay * 2, 30_000);
          }
        })
        .finally(() => {
          inFlight = false;
        });
    };
    if (ws.isConnected) {
      attempt();
    }
    const unsubscribe = ws.onStatus((connected) => {
      if (connected) {
        attempt();
      }
    });
    return () => {
      cancelled = true;
      unsubscribe();
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [activeBridgeProfileId, api, appStateStore, currentScreen, ws]);

  useEffect(() => {
    if (!api || !ws || currentScreen === 'Onboarding') {
      return;
    }

    let cancelled = false;
    let prefetchTimer: ReturnType<typeof setTimeout> | null = null;

    const runPrefetch = () => {
      if (cancelled) {
        return;
      }
      void api.primeChats({ limit: APP_PREFETCH_CHAT_LIMIT }).catch(() => {});
    };

    const schedulePrefetch = () => {
      if (prefetchTimer) {
        return;
      }

      prefetchTimer = setTimeout(() => {
        prefetchTimer = null;
        runPrefetch();
      }, APP_PREFETCH_DELAY_MS);
    };

    schedulePrefetch();
    const unsubscribeStatus = ws.onStatus((connected) => {
      if (connected) {
        schedulePrefetch();
      }
    });

    return () => {
      cancelled = true;
      if (prefetchTimer) {
        clearTimeout(prefetchTimer);
        prefetchTimer = null;
      }
      unsubscribeStatus();
    };
  }, [api, currentScreen, ws]);

  useEffect(() => {
    let cancelled = false;

    const loadSettings = async () => {
      try {
        await appStateStore.initialize();
        if (cancelled) {
          return;
        }
        const profileStore = appStateStore.getSnapshot().data.bridgeProfiles;
        const activeProfile = getActiveBridgeProfile(profileStore);
        const snapshotCache = activeProfile
          ? await loadChatSnapshotCache(activeProfile.id)
          : null;
        if (cancelled) {
          return;
        }
        const selectedSnapshot =
          snapshotCache?.entries.find((entry) => entry.chat.id === snapshotCache.selectedChatId)?.chat ?? null;

        setChatSnapshotCache(snapshotCache);
        setSelectedChatId(selectedSnapshot?.id ?? null);
        setActiveChat(selectedSnapshot);
        setPendingMainChatId(selectedSnapshot?.id ?? null);
        setPendingMainChatSnapshot(selectedSnapshot);
      } catch {
        // The typed persistence error remains available in the app-state snapshot.
      }
    };

    void loadSettings();
    return () => {
      cancelled = true;
    };
  }, [
    appStateStore,
    setActiveChat,
    setChatSnapshotCache,
    setPendingMainChatId,
    setPendingMainChatSnapshot,
    setSelectedChatId,
  ]);

  useEffect(() => {
    if (!api || !chatSnapshotCache || chatSnapshotCache.profileId !== activeBridgeProfile?.id) {
      return;
    }
    for (const entry of chatSnapshotCache.entries) {
      api.rememberChat(entry.chat);
    }
  }, [activeBridgeProfile?.id, api, chatSnapshotCache]);

  useEffect(() => {
    const profileId = activeBridgeProfile?.id;
    if (!profileId || !settingsLoaded) {
      return;
    }

    if (chatSnapshotPersistTimerRef.current) {
      clearTimeout(chatSnapshotPersistTimerRef.current);
    }
    chatSnapshotPersistTimerRef.current = setTimeout(() => {
      chatSnapshotPersistTimerRef.current = null;
      setChatSnapshotCache((previous) => {
        const base =
          previous?.profileId === profileId ? previous : createEmptyChatSnapshotCache(profileId);
        const next = updateChatSnapshotCache(base, selectedChatId, activeChat);
        void saveChatSnapshotCache(next).catch(() => {});
        return next;
      });
    }, CHAT_SNAPSHOT_PERSIST_DELAY_MS);

    return () => {
      if (chatSnapshotPersistTimerRef.current) {
        clearTimeout(chatSnapshotPersistTimerRef.current);
        chatSnapshotPersistTimerRef.current = null;
      }
    };
  }, [
    activeBridgeProfile?.id,
    activeChat,
    chatSnapshotPersistTimerRef,
    selectedChatId,
    setChatSnapshotCache,
    settingsLoaded,
  ]);
}