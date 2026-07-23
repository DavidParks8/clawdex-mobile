import { useCallback } from 'react';
import type { MainScreenSection26Context, MainScreenSection26Output } from './mainScreenSection26';
import { executeSendMessage, type SendMessageOptions } from './mainScreenSendMessage';




export type MainScreenSection27Context = MainScreenSection26Context & MainScreenSection26Output;

export function useMainScreenSection27(context: MainScreenSection27Context) {
  const {
    activeAgentId,
    activeApprovalPolicy,
    activeBridgeUiSurfaces,
    activeEffort,
    activeModelId,
    activeServiceTier,
    api,
    attachmentController,
    bumpRunWatchdog,
    cacheThreadPlan,
    cacheThreadQueueState,
    clearRunWatchdog,
    discardOptimisticQueuedMessage,
    discardOptimisticUserMessage,
    draftController,
    handleSlashCommand,
    handleTurnFailure,
    mergeChatWithPendingOptimisticMessages,
    pendingApproval,
    pendingLocalImagePaths,
    pendingMentionPaths,
    pendingUserInputRequest,
    queueOptimisticQueuedMessage,
    queueOptimisticUserMessage,
    registerTurnStarted,
    rememberChatModelPreference,
    replaceThreadBridgeUiSurfaces,
    scrollToBottomReliable,
    selectedChat,
    selectedChatId,
    selectedCollaborationMode,
    submissionController,
  } = context;


  const sendMessageContent = useCallback(
    (
      rawContent: string,
      options?: SendMessageOptions
    ) => executeSendMessage(context, rawContent, options),
    [
      activeAgentId,
      activeEffort,
      activeModelId,
      activeApprovalPolicy,
      activeServiceTier,
      api,
      attachmentController,
      activeBridgeUiSurfaces,
      draftController,
      cacheThreadPlan,
      cacheThreadQueueState,
      handleSlashCommand,
      pendingMentionPaths,
      pendingLocalImagePaths,
      pendingApproval?.requestId,
      pendingUserInputRequest?.requestId,
      selectedCollaborationMode,
      selectedChat,
      selectedChatId,
      handleTurnFailure,
      bumpRunWatchdog,
      clearRunWatchdog,
      discardOptimisticUserMessage,
      discardOptimisticQueuedMessage,
      mergeChatWithPendingOptimisticMessages,
      queueOptimisticUserMessage,
      queueOptimisticQueuedMessage,
      registerTurnStarted,
      replaceThreadBridgeUiSurfaces,
      rememberChatModelPreference,
      scrollToBottomReliable,
      submissionController,
    ]
  );

  return {
    sendMessageContent,
  };
}

export type MainScreenSection27Output = ReturnType<typeof useMainScreenSection27>;
