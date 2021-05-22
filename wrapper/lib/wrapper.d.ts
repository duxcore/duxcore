import { client as WebSocketClient, connection } from "websocket";
export default class Wrapper {
    socket: WebSocketClient;
    connection?: connection;
    constructor(wsUrl: string);
}
