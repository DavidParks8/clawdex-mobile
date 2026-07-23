import { useEffect } from 'react';
import type { Dispatch, MutableRefObject, SetStateAction } from 'react';

import {
  addNotificationResponseListener,
  getInitialNotificationResponse,
  registerNotificationCategories,
  setupNotificationHandler,
  type PushResponseEvent,
} from '../pushNotifications';
import { PushResponseController } from '../pushResponseController';
import type { PushProfileRegistration } from '../appState';
import type { HostBridgeApiClient } from '../api/client';
import type { HostBridgeWsClient } from '../api/ws';
import type { Chat } from '../api/types';
import type { Screen } from './appConstants';

interface UsePushNotificationsLifecycleArgs {
  activeBridgeProfileId: string | null;
  registrations: PushProfileRegistration[];
  api: HostBridgeApiClient | null;
  ws: HostBridgeWsClient | null;
  pushResponseControllerRef: MutableRefObject<PushResponseController | null>;
  setCurrentScreen: Dispatch<SetStateAction<Screen>>;
  setPendingMainChatId: Dispatch<SetStateAction<string | null>>;
  setPendingMainChatSnapshot: Dispatch<SetStateAction<Chat | null>>;
}

export function usePushNotificationsLifecycle({
  activeBridgeProfileId,
  registrations,
  api,
  ws,
  pushResponseControllerRef,
  setCurrentScreen,
  setPendingMainChatId,
  setPendingMainChatSnapshot,
}: UsePushNotificationsLifecycleArgs): void {
  useEffect(() => {
    setupNotificationHandler();
    void registerNotificationCategories();
    const controller = new PushResponseController((event: PushResponseEvent) => {
      const { target } = event;
      setCurrentScreen('Main');
      if (target.threadId) {
        setPendingMainChatId(target.threadId);
        setPendingMainChatSnapshot(null);
      }
    });
    pushResponseControllerRef.current = controller;

    const subscription = addNotificationResponseListener((event) => controller.handle(event));
    void getInitialNotificationResponse().then((event) => {
      if (event) controller.handle(event);
    });
    return () => {
      subscription.remove();
      controller.dispose();
      pushResponseControllerRef.current = null;
    };
  }, [pushResponseControllerRef, setCurrentScreen, setPendingMainChatId, setPendingMainChatSnapshot]);

  useEffect(() => {
    const registration = registrations.find((entry) => entry.profileId === activeBridgeProfileId);
    pushResponseControllerRef.current?.setProfile(
      activeBridgeProfileId && registration && api && ws
        ? {
            profileId: activeBridgeProfileId,
            registrationId: registration.registrationId,
            api,
            ws,
          }
        : null
    );
  }, [activeBridgeProfileId, api, registrations, ws, pushResponseControllerRef]);
}