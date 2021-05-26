import { w3cwebsocket as WebSocketClient } from "websocket";
import { OpCodePayload, OpCodeResponse } from "../util/types/socket";
import Wrapper from "../wrapper";
export default class SocketAPI {
    base: WebSocketClient;
    wrapper: Wrapper;
    url: string;
    private _onFetchDoneQueue;
    private _heartbeat;
    constructor(socket: WebSocketClient, wrapper: Wrapper);
    private _handleQueueRoutine;
    private wscon;
    private extractError;
    private startHeartbeat;
    close(): void;
    fetch<OP extends keyof OpCodePayload>(op: OP, payload?: OpCodePayload[OP]): Promise<OpCodeResponse[OP]>;
}
