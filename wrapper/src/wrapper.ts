import { w3cwebsocket as WebSocketClient } from "websocket"
import { Session } from "./classes/Session";
import SocketAPI from "./classes/SocketAPI";

export default class Wrapper {
  public socket: SocketAPI;
  public session: Session = new Session(this);

  constructor(wsUrl: string) {
    const socket = new WebSocketClient(wsUrl);
    this.socket = new SocketAPI(socket, this);
  }

  close() { this.socket.close(); }

  authenticateSession() {
    
  }
}