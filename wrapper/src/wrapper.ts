import { client as WebSocketClient, connection } from "websocket"

export default class Wrapper {
  public socket: WebSocketClient = new WebSocketClient();
  public connection?: connection;

  constructor(wsUrl: string) {
    this.socket.on("connectFailed", (err) => { throw err });
    this.socket.on("connect", conn => this.connection = conn); 

    this.socket.connect(wsUrl);
  }
}