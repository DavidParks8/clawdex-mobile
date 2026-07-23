import { processMainScreenEvents06 } from './mainScreenEvents06';
import { processMainScreenEvents01 } from './mainScreenEvents01';
import { processMainScreenEvents02 } from './mainScreenEvents02';
import { processMainScreenEvents03 } from './mainScreenEvents03';
import { processMainScreenEvents04 } from './mainScreenEvents04';
import { processMainScreenEvents05 } from './mainScreenEvents05';
import { useEffect } from 'react';
import type { RpcNotification } from '../api/types';
import { parseAgUiEventNotification } from '../api/agUi';
import type { MainScreenSection29Context, MainScreenSection29Output } from './mainScreenSection29';






export type MainScreenSection30Context = MainScreenSection29Context & MainScreenSection29Output;

export function useMainScreenSection30(context: MainScreenSection30Context) {
  const {
    agentDetailThreadId,
    api,
    appendStopSystemMessageIfNeeded,
    bumpAgentRuntimeRevision,
    bumpRunWatchdog,
    cacheThreadActiveCommand,
    cacheThreadActivity,
    cacheThreadBridgeUiSurface,
    cacheThreadContextUsage,
    cacheThreadPendingApproval,
    cacheThreadPendingUserInputRequest,
    cacheThreadPlan,
    cacheThreadStreamingDelta,
    cacheThreadTurnState,
    chatIdRef,
    clearDeferredDisconnectActivity,
    clearLiveReasoningMessage,
    clearPendingPlanImplementationPrompt,
    clearRunWatchdog,
    loadAgentDetail,
    loadChat,
    pendingApproval,
    pendingUserInputRequest,
    pushActiveCommand,
    readThreadContextUsage,
    recoverReplayGap,
    refreshPendingApprovalsForThread,
    registerTurnStarted,
    removeThreadBridgeUiSurface,
    replaceThreadBridgeUiSurfaces,
    scheduleAgentThreadsRefresh,
    scheduleDisconnectActivity,
    scheduleExternalStatusFullSync,
    scrollToBottomIfPinned,
    upsertLiveReasoningMessage,
    upsertThreadRuntimeSnapshot,
    ws,
  } = context;


  useEffect(() => {
    const pendingApprovalId = pendingApproval?.requestId;
    const pendingUserInputRequestId = pendingUserInputRequest?.requestId;

    return ws.onEvent((event: RpcNotification) => {
      const currentId = chatIdRef.current;
      if (parseAgUiEventNotification(event)) {
        processMainScreenEvents01(context, event, currentId);
        return;
      }
      if (
        event.method === 'bridge/events/snapshotRequired' ||
        event.method === 'thread/name/updated' ||
        event.method === 'thread/subagent/adopted' ||
        event.method === 'thread/tokenUsage/updated' ||
        event.method === 'item/started'
      ) {
        processMainScreenEvents02(context, event, currentId);
        return;
      }
      if (
        event.method === 'item/plan/delta' ||
        event.method.startsWith('item/reasoning/') ||
        event.method === 'item/commandExecution/outputDelta' ||
        event.method === 'item/mcpToolCall/progress' ||
        event.method === 'item/commandExecution/terminalInteraction'
      ) {
        processMainScreenEvents03(context, event, currentId);
        return;
      }
      if (
        event.method === 'turn/plan/updated' ||
        event.method === 'turn/diff/updated' ||
        event.method === 'item/completed' ||
        event.method === 'thread/status/changed'
      ) {
        processMainScreenEvents06(
          context,
          event,
          currentId,
          pendingApprovalId,
          pendingUserInputRequestId
        );
        return;
      }
      if (event.method.startsWith('bridge/')) {
        if (event.method === 'bridge/connection/state') {
          processMainScreenEvents05(context, event, currentId);
          return;
        }
        processMainScreenEvents04(
          context,
          event,
          currentId,
          pendingApprovalId,
          pendingUserInputRequestId
        );
      }
    });
  }, [
    ws,
    api,
    pendingApproval?.requestId,
    pendingUserInputRequest?.requestId,
    recoverReplayGap,
    loadChat,
    loadAgentDetail,
    scheduleAgentThreadsRefresh,
    appendStopSystemMessageIfNeeded,
    agentDetailThreadId,
    bumpRunWatchdog,
    bumpAgentRuntimeRevision,
    clearDeferredDisconnectActivity,
    cacheThreadActiveCommand,
    cacheThreadActivity,
    cacheThreadContextUsage,
    cacheThreadBridgeUiSurface,
    cacheThreadPendingApproval,
    cacheThreadPendingUserInputRequest,
    cacheThreadPlan,
    cacheThreadStreamingDelta,
    cacheThreadTurnState,
    clearPendingPlanImplementationPrompt,
    clearLiveReasoningMessage,
    clearRunWatchdog,
    readThreadContextUsage,
    replaceThreadBridgeUiSurfaces,
    refreshPendingApprovalsForThread,
    removeThreadBridgeUiSurface,
    scheduleDisconnectActivity,
    scheduleExternalStatusFullSync,
    registerTurnStarted,
    pushActiveCommand,
    scrollToBottomIfPinned,
    upsertLiveReasoningMessage,
    upsertThreadRuntimeSnapshot,
  ]);

  return {};
}

export type MainScreenSection30Output = ReturnType<typeof useMainScreenSection30>;
