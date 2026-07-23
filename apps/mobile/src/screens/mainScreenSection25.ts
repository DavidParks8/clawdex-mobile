import { useEffect } from 'react';
import type { RpcNotification } from '../api/types';
import { parseAgUiEventNotification } from '../api/agUi';
import { toRecord, extractNotificationThreadId, extractNotificationParentThreadId } from './mainScreenHelpers';
import type { MainScreenSection24Context, MainScreenSection24Output } from './mainScreenSection24';






export type MainScreenSection25Context = MainScreenSection24Context & MainScreenSection24Output;

export function useMainScreenSection25(context: MainScreenSection25Context) {
  const {
    agentRootThreadIdRef,
    chatIdRef,
    scheduleAgentThreadsRefresh,
    ws,
  } = context;


  useEffect(() => {
    return ws.onEvent((event: RpcNotification) => {
      const agUi = parseAgUiEventNotification(event);
      const agUiLifecycle = agUi &&
        (agUi.event.type === 'RUN_STARTED' ||
          agUi.event.type === 'RUN_FINISHED' ||
          agUi.event.type === 'RUN_ERROR');
      if (
        event.method !== 'thread/started' &&
        event.method !== 'thread/name/updated' &&
        event.method !== 'thread/status/changed' &&
        !agUiLifecycle
      ) {
        return;
      }

      const currentThreadId = chatIdRef.current;
      const currentRootThreadId = agentRootThreadIdRef.current;
      if (!currentThreadId || !currentRootThreadId) {
        return;
      }

      const params = toRecord(event.params);
      const eventThreadId = agUi?.threadId ?? extractNotificationThreadId(params);
      const eventParentThreadId = extractNotificationParentThreadId(params);
      if (
        eventThreadId &&
        eventThreadId !== currentThreadId &&
        eventThreadId !== currentRootThreadId &&
        eventParentThreadId !== currentThreadId &&
        eventParentThreadId !== currentRootThreadId
      ) {
        return;
      }

      scheduleAgentThreadsRefresh(currentThreadId);
    });
  }, [scheduleAgentThreadsRefresh, ws]);

  return {};
}

export type MainScreenSection25Output = ReturnType<typeof useMainScreenSection25>;
