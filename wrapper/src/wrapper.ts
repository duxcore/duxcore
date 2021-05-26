import { w3cwebsocket as WebSocketClient, connection } from "websocket"

export default class Wrapper {
  public socket: WebSocketClient;
  public connection?: connection;

  constructor(wsUrl: string) {
    this.socket =  new WebSocketClient(wsUrl);

    this.socket.onerror = (err) => {
      throw err;
    }
  }
}