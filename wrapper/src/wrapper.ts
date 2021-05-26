import { w3cwebsocket as WebSocketClient } from "websocket"
import SocketAPI from "./classes/SocketAPI";

export default class Wrapper {
  public socket: SocketAPI;

  constructor(wsUrl: string) {
    const socket = new WebSocketClient(wsUrl);
    this.socket = new SocketAPI(socket, this);
  }

  close() { this.socket.close(); }

  authenticateSession() {
    
  }
}