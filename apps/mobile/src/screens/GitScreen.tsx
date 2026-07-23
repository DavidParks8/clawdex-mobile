import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { HostBridgeApiClient } from '../api/client';
import type { ApprovalMode, Chat } from '../api/types';
import { useAccessibilityAnnouncement } from '../accessibility';
import { useAppTheme } from '../theme';
import { GitScreenBranchSummarySection } from './GitScreenBranchSummarySection';
import { GitScreenCommitHistorySection } from './GitScreenCommitHistorySection';
import { GitScreenDiffSection } from './GitScreenDiffSection';
import { GitScreenHeaderSection } from './GitScreenHeaderSection';
import { GitScreenReviewSection } from './GitScreenReviewSection';
import { GitScreenWorkspaceSection } from './GitScreenWorkspaceSection';
import { useGitScreenController } from './gitScreenController';
import { createGitScreenStyles } from './gitScreenStyles';

interface GitScreenProps {
  api: HostBridgeApiClient;
  chat: Chat;
  approvalMode?: ApprovalMode;
  onBack: () => void;
  onChatUpdated?: (chat: Chat) => void;
}

export function GitScreen({ api, chat, approvalMode, onBack, onChatUpdated }: GitScreenProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createGitScreenStyles(theme), [theme]);

  const controller = useGitScreenController({
    api,
    chat,
    approvalMode,
    onBack,
    onChatUpdated,
  });

  useAccessibilityAnnouncement(controller.error);
  useAccessibilityAnnouncement(
    controller.loading
      ? 'Loading Git status'
      : controller.committing
        ? 'Committing changes'
        : controller.pushing
          ? 'Pushing changes'
          : controller.switchingBranch
            ? 'Switching branch'
            : null
  );

  return (
    <SafeAreaView style={styles.container}>
      <GitScreenHeaderSection controller={controller} styles={styles} theme={theme} onBack={onBack} />

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        scrollEnabled={controller.bodyScrollEnabled}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
      >
        <GitScreenWorkspaceSection controller={controller} styles={styles} theme={theme} />

        {controller.loading ? (
          <ActivityIndicator
            accessibilityRole="progressbar"
            accessibilityLabel="Loading Git status"
            color={theme.colors.textPrimary}
            style={styles.loader}
          />
        ) : (
          <>
            <GitScreenBranchSummarySection controller={controller} styles={styles} theme={theme} />
            <GitScreenCommitHistorySection controller={controller} styles={styles} theme={theme} />
            <GitScreenDiffSection controller={controller} styles={styles} theme={theme} />
          </>
        )}

        {controller.error ? (
          <Text accessibilityRole="alert" accessibilityLiveRegion="assertive" style={styles.errorText}>
            {controller.error}
          </Text>
        ) : null}
      </ScrollView>

      <GitScreenReviewSection controller={controller} styles={styles} theme={theme} />
    </SafeAreaView>
  );
}
