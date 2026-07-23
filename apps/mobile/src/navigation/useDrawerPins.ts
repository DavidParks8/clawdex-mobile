import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActionSheetIOS, Alert, Platform } from 'react-native';
import type { ChatSummary } from '../api/types';
import type { ChatWorkspaceSection } from './chatThreadTree';
import {
  loadPinnedChatIds,
  loadPinnedWorkspacePaths,
  persistPinnedChatIds,
  persistPinnedWorkspacePaths,
  PINNED_WORKSPACE_PATHS_LIMIT,
} from './drawerContentPersistence';

function showPinAction(title: string, prompt: string, action: () => void): void {
  if (Platform.OS === 'ios') {
    ActionSheetIOS.showActionSheetWithOptions(
      { options: [title, 'Cancel'], cancelButtonIndex: 1, title: prompt },
      (buttonIndex) => {
        if (buttonIndex === 0) action();
      }
    );
    return;
  }
  Alert.alert(prompt, undefined, [
    { text: title, onPress: action },
    { text: 'Cancel', style: 'cancel' },
  ]);
}

export function useDrawerPins() {
  const [pinnedChatIds, setPinnedChatIds] = useState<string[]>([]);
  const [pinnedWorkspacePaths, setPinnedWorkspacePaths] = useState<string[]>([]);
  useEffect(() => {
    let cancelled = false;
    void loadPinnedChatIds().then((ids) => {
      if (!cancelled) setPinnedChatIds(ids);
    });
    return () => { cancelled = true; };
  }, []);
  useEffect(() => {
    let cancelled = false;
    void loadPinnedWorkspacePaths().then((paths) => {
      if (!cancelled) setPinnedWorkspacePaths(paths);
    });
    return () => { cancelled = true; };
  }, []);
  const pinnedChatIdSet = useMemo(() => new Set(pinnedChatIds), [pinnedChatIds]);
  const pinnedWorkspacePathSet = useMemo(
    () => new Set(pinnedWorkspacePaths),
    [pinnedWorkspacePaths]
  );
  const showChatPinAction = useCallback((chat: ChatSummary) => {
    const isPinned = pinnedChatIdSet.has(chat.id);
    showPinAction(isPinned ? 'Unpin chat' : 'Pin chat', isPinned ? 'Unpin this chat?' : 'Pin this chat?', () => {
      setPinnedChatIds((previous) => {
        const next = previous.includes(chat.id)
          ? previous.filter((id) => id !== chat.id)
          : [chat.id, ...previous.filter((id) => id !== chat.id)];
        void persistPinnedChatIds(next);
        return next;
      });
    });
  }, [pinnedChatIdSet]);
  const showWorkspacePinAction = useCallback((section: ChatWorkspaceSection) => {
    const isPinned = pinnedWorkspacePathSet.has(section.key);
    showPinAction(isPinned ? 'Unpin workspace' : 'Pin workspace', isPinned ? 'Unpin this workspace?' : 'Pin this workspace?', () => {
      setPinnedWorkspacePaths((previous) => {
        const next = previous.includes(section.key)
          ? previous.filter((path) => path !== section.key)
          : [section.key, ...previous.filter((path) => path !== section.key)]
            .slice(0, PINNED_WORKSPACE_PATHS_LIMIT);
        void persistPinnedWorkspacePaths(next);
        return next;
      });
    });
  }, [pinnedWorkspacePathSet]);
  return { pinnedChatIds, pinnedWorkspacePaths, pinnedChatIdSet,
    pinnedWorkspacePathSet, showChatPinAction, showWorkspacePinAction };
}