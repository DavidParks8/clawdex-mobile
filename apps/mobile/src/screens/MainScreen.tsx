import { forwardRef } from 'react';
import type { HostBridgeApiClient } from '../api/client';
import type {
  AgentDefaultSettingsMap,
  AgentId,
  ApprovalMode,
  Chat,
  CollaborationMode,
} from '../api/types';
import type { HostBridgeWsClient } from '../api/ws';
import { useMainScreenSection01 } from './mainScreenSection01';
import { useMainScreenSection02 } from './mainScreenSection02';
import { useMainScreenSection03 } from './mainScreenSection03';
import { useMainScreenSection04 } from './mainScreenSection04';
import { useMainScreenSection05 } from './mainScreenSection05';
import { useMainScreenSection06 } from './mainScreenSection06';
import { useMainScreenSection07 } from './mainScreenSection07';
import { useMainScreenSection08 } from './mainScreenSection08';
import { useMainScreenSection09 } from './mainScreenSection09';
import { useMainScreenSection10 } from './mainScreenSection10';
import { useMainScreenSection11 } from './mainScreenSection11';
import { useMainScreenSection12 } from './mainScreenSection12';
import { useMainScreenSection13 } from './mainScreenSection13';
import { useMainScreenSection14 } from './mainScreenSection14';
import { useMainScreenSection15 } from './mainScreenSection15';
import { useMainScreenSection16 } from './mainScreenSection16';
import { useMainScreenSection17 } from './mainScreenSection17';
import { useMainScreenSection18 } from './mainScreenSection18';
import { useMainScreenSection19 } from './mainScreenSection19';
import { useMainScreenSection20 } from './mainScreenSection20';
import { useMainScreenSection21 } from './mainScreenSection21';
import { useMainScreenSection22 } from './mainScreenSection22';
import { useMainScreenSection23 } from './mainScreenSection23';
import { useMainScreenSection24 } from './mainScreenSection24';
import { useMainScreenSection25 } from './mainScreenSection25';
import { useMainScreenSection26 } from './mainScreenSection26';
import { useMainScreenSection27 } from './mainScreenSection27';
import { useMainScreenSection28 } from './mainScreenSection28';
import { useMainScreenSection29 } from './mainScreenSection29';
import { useMainScreenSection30 } from './mainScreenSection30';
import { useMainScreenSection31 } from './mainScreenSection31';
import { useMainScreenSection32 } from './mainScreenSection32';
import { useMainScreenSection33 } from './mainScreenSection33';
import { useMainScreenSection34 } from './mainScreenSection34';
import { useMainScreenSection35 } from './mainScreenSection35';
import { useMainScreenSection36 } from './mainScreenSection36';
import { useMainScreenSection37 } from './mainScreenSection37';
import type {
  MainScreenSection37Context,
  MainScreenSection37Output,
} from './mainScreenSection37';
import { MainScreenView } from './MainScreenView';

export interface MainScreenHandle {
  openChat: (id: string, optimisticChat?: Chat | null) => void;
  startNewChat: () => void;
}

export interface MainScreenProps {
  api: HostBridgeApiClient;
  ws: HostBridgeWsClient;
  bridgeUrl: string;
  bridgeToken?: string | null;
  bridgeProfileId: string;
  onOpenDrawer: () => void;
  onOpenGit: (chat: Chat) => void;
  onOpenLocalPreview?: (targetUrl: string) => void;
  onOpenBridgeRecoveryGuide?: () => void;
  defaultStartCwd?: string | null;
  preferredAgentId?: AgentId | null;
  agentSettings?: AgentDefaultSettingsMap | null;
  approvalMode?: ApprovalMode;
  showToolCalls?: boolean;
  onDefaultStartCwdChange?: (cwd: string | null) => void;
  onLastUsedThreadSettingsChange?: (
    agentId: AgentId,
    collaborationMode: CollaborationMode
  ) => void;
  onChatContextChange?: (chat: Chat | null) => void;
  onChatOpeningStateChange?: (chatId: string | null) => void;
  pendingOpenChatId?: string | null;
  pendingOpenChatSnapshot?: Chat | null;
  onPendingOpenChatHandled?: () => void;
}

export const MainScreen = forwardRef<MainScreenHandle, MainScreenProps>(
  function MainScreen(
    {
      api,
      ws,
      bridgeUrl,
      bridgeToken = null,
      bridgeProfileId,
      onOpenDrawer,
      onOpenGit,
      onOpenLocalPreview: onOpenLocalPreviewHandler,
      onOpenBridgeRecoveryGuide,
      defaultStartCwd,
      preferredAgentId,
      agentSettings,
      approvalMode,
      showToolCalls = true,
      onDefaultStartCwdChange,
      onLastUsedThreadSettingsChange,
      onChatContextChange,
      onChatOpeningStateChange,
      pendingOpenChatId,
      pendingOpenChatSnapshot,
      onPendingOpenChatHandled,
    },
    ref
  ) {
    const mainScreenBaseContext = {
      api,
      ws,
      bridgeUrl,
      bridgeToken,
      bridgeProfileId,
      onOpenDrawer,
      onOpenGit,
      onOpenLocalPreview: onOpenLocalPreviewHandler ?? undefined,
      onOpenBridgeRecoveryGuide,
      defaultStartCwd,
      preferredAgentId,
      agentSettings,
      approvalMode,
      showToolCalls: showToolCalls ?? true,
      onDefaultStartCwdChange,
      onLastUsedThreadSettingsChange,
      onChatContextChange,
      onChatOpeningStateChange,
      pendingOpenChatId,
      pendingOpenChatSnapshot,
      onPendingOpenChatHandled,
      ref,
    };
    const mainScreenSection01Output = useMainScreenSection01(mainScreenBaseContext);
    const mainScreenContext01 = { ...mainScreenBaseContext, ...mainScreenSection01Output };
    const mainScreenSection02Output = useMainScreenSection02(mainScreenContext01);
    const mainScreenContext02 = { ...mainScreenContext01, ...mainScreenSection02Output };
    const mainScreenSection03Output = useMainScreenSection03(mainScreenContext02);
    const mainScreenContext03 = { ...mainScreenContext02, ...mainScreenSection03Output };
    const mainScreenSection04Output = useMainScreenSection04(mainScreenContext03);
    const mainScreenContext04 = { ...mainScreenContext03, ...mainScreenSection04Output };
    const mainScreenSection05Output = useMainScreenSection05(mainScreenContext04);
    const mainScreenContext05 = { ...mainScreenContext04, ...mainScreenSection05Output };
    const mainScreenSection06Output = useMainScreenSection06(mainScreenContext05);
    const mainScreenContext06 = { ...mainScreenContext05, ...mainScreenSection06Output };
    const mainScreenSection07Output = useMainScreenSection07(mainScreenContext06);
    const mainScreenContext07 = { ...mainScreenContext06, ...mainScreenSection07Output };
    const mainScreenSection08Output = useMainScreenSection08(mainScreenContext07);
    const mainScreenContext08 = { ...mainScreenContext07, ...mainScreenSection08Output };
    const mainScreenSection09Output = useMainScreenSection09(mainScreenContext08);
    const mainScreenContext09 = { ...mainScreenContext08, ...mainScreenSection09Output };
    const mainScreenSection10Output = useMainScreenSection10(mainScreenContext09);
    const mainScreenContext10 = { ...mainScreenContext09, ...mainScreenSection10Output };
    const mainScreenSection11Output = useMainScreenSection11(mainScreenContext10);
    const mainScreenContext11 = { ...mainScreenContext10, ...mainScreenSection11Output };
    const mainScreenSection12Output = useMainScreenSection12(mainScreenContext11);
    const mainScreenContext12 = { ...mainScreenContext11, ...mainScreenSection12Output };
    const mainScreenSection13Output = useMainScreenSection13(mainScreenContext12);
    const mainScreenContext13 = { ...mainScreenContext12, ...mainScreenSection13Output };
    const mainScreenSection14Output = useMainScreenSection14(mainScreenContext13);
    const mainScreenContext14 = { ...mainScreenContext13, ...mainScreenSection14Output };
    const mainScreenSection15Output = useMainScreenSection15(mainScreenContext14);
    const mainScreenContext15 = { ...mainScreenContext14, ...mainScreenSection15Output };
    const mainScreenSection16Output = useMainScreenSection16(mainScreenContext15);
    const mainScreenContext16 = { ...mainScreenContext15, ...mainScreenSection16Output };
    const mainScreenSection17Output = useMainScreenSection17(mainScreenContext16);
    const mainScreenContext17 = { ...mainScreenContext16, ...mainScreenSection17Output };
    const mainScreenSection18Output = useMainScreenSection18(mainScreenContext17);
    const mainScreenContext18 = { ...mainScreenContext17, ...mainScreenSection18Output };
    const mainScreenSection19Output = useMainScreenSection19(mainScreenContext18);
    const mainScreenContext19 = { ...mainScreenContext18, ...mainScreenSection19Output };
    const mainScreenSection20Output = useMainScreenSection20(mainScreenContext19);
    const mainScreenContext20 = { ...mainScreenContext19, ...mainScreenSection20Output };
    const mainScreenSection21Output = useMainScreenSection21(mainScreenContext20);
    const mainScreenContext21 = { ...mainScreenContext20, ...mainScreenSection21Output };
    const mainScreenSection22Output = useMainScreenSection22(mainScreenContext21);
    const mainScreenContext22 = { ...mainScreenContext21, ...mainScreenSection22Output };
    const mainScreenSection23Output = useMainScreenSection23(mainScreenContext22);
    const mainScreenContext23 = { ...mainScreenContext22, ...mainScreenSection23Output };
    const mainScreenSection24Output = useMainScreenSection24(mainScreenContext23);
    const mainScreenContext24 = { ...mainScreenContext23, ...mainScreenSection24Output };
    const mainScreenSection25Output = useMainScreenSection25(mainScreenContext24);
    const mainScreenContext25 = { ...mainScreenContext24, ...mainScreenSection25Output };
    const mainScreenSection26Output = useMainScreenSection26(mainScreenContext25);
    const mainScreenContext26 = { ...mainScreenContext25, ...mainScreenSection26Output };
    const mainScreenSection27Output = useMainScreenSection27(mainScreenContext26);
    const mainScreenContext27 = { ...mainScreenContext26, ...mainScreenSection27Output };
    const mainScreenSection28Output = useMainScreenSection28(mainScreenContext27);
    const mainScreenContext28 = { ...mainScreenContext27, ...mainScreenSection28Output };
    const mainScreenSection29Output = useMainScreenSection29(mainScreenContext28);
    const mainScreenContext29 = { ...mainScreenContext28, ...mainScreenSection29Output };
    const mainScreenSection30Output = useMainScreenSection30(mainScreenContext29);
    const mainScreenContext30 = { ...mainScreenContext29, ...mainScreenSection30Output };
    const mainScreenSection31Output = useMainScreenSection31(mainScreenContext30);
    const mainScreenContext31 = { ...mainScreenContext30, ...mainScreenSection31Output };
    const mainScreenSection32Output = useMainScreenSection32(mainScreenContext31);
    const mainScreenContext32 = { ...mainScreenContext31, ...mainScreenSection32Output };
    const mainScreenSection33Output = useMainScreenSection33(mainScreenContext32);
    const mainScreenContext33 = { ...mainScreenContext32, ...mainScreenSection33Output };
    const mainScreenSection34Output = useMainScreenSection34(mainScreenContext33);
    const mainScreenContext34 = { ...mainScreenContext33, ...mainScreenSection34Output };
    const mainScreenSection35Output = useMainScreenSection35(mainScreenContext34);
    const mainScreenContext35 = { ...mainScreenContext34, ...mainScreenSection35Output };
    const mainScreenSection36Output = useMainScreenSection36(mainScreenContext35);
    const mainScreenContext36 = { ...mainScreenContext35, ...mainScreenSection36Output };
    const mainScreenSection37Output = useMainScreenSection37(mainScreenContext36);
    const mainScreenContext37 = { ...mainScreenContext36, ...mainScreenSection37Output };
    const mainScreenContext = mainScreenContext37 as MainScreenSection37Context & MainScreenSection37Output;
    return <MainScreenView context={mainScreenContext} />;
  }
);
