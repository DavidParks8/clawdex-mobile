import { HostBridgeWsClientPart4 } from "./HostBridgeWsClientPart4";

export {
  BridgeProtocolVersionError,
  isRpcRequestError,
  RpcRequestError,
} from "./wsErrors";

export class HostBridgeWsClient extends HostBridgeWsClientPart4 {}
