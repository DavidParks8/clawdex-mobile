import { HostBridgeApiClientPart6 } from "./HostBridgeApiClientPart6";

export { StaleSnapshotRevisionError } from "./clientSnapshotErrors";
export { mergeSnapshotPage } from "./clientInternalsPart1";
export type {
  SnapshotPageEntry,
  SnapshotPageResponse,
  SendOrQueueChatMessageResult,
} from "./clientInternalsPart1";
export type { ChatListResult } from "./clientInternalsPart2";

export class HostBridgeApiClient extends HostBridgeApiClientPart6 {}
