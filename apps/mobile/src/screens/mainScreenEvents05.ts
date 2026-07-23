import type { RpcNotification } from '../api/types';
import { toRecord, readString } from './mainScreenHelpers';
import type { MainScreenSection30Context } from './mainScreenSection30';


export function processMainScreenEvents05(
  context: MainScreenSection30Context,
  event: RpcNotification,
  currentId: string | null
): void {
  const {
    clearDeferredDisconnectActivity,
    setBridgeRecoveryBannerVisible,
    setActivity,
    clearRunWatchdog,
    loadChat,
    appStateRef,
    scheduleDisconnectActivity,
  } = context;

      if (event.method === 'bridge/connection/state') {
        const params = toRecord(event.params);
        const status = readString(params?.status);
        if (status === 'connected') {
          clearDeferredDisconnectActivity();
          setBridgeRecoveryBannerVisible(false);
          if (!currentId) {
            return;
          }
          setActivity((prev) =>
            prev.tone === 'running'
              ? prev
              : {
                  tone: 'idle',
                  title: 'Connected',
                }
          );
          clearRunWatchdog();
          loadChat(currentId, { preserveRuntimeState: true }).catch(() => {});
          return;
        }

        if (status === 'disconnected') {
          clearRunWatchdog();
          if (appStateRef.current !== 'active') {
            clearDeferredDisconnectActivity();
            return;
          }
          scheduleDisconnectActivity();
        }
      }
}
