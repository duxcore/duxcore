import { w3cwebsocket as WebSocketClient } from "websocket"
import { Auth } from "./classes/Auth";
import { Session } from "./classes/Session";
import SocketAPI from "./classes/SocketAPI";

export default class Wrapper {
  public socket: SocketAPI;
  public session: Session = new Session(this);
  public auth: Auth = new Auth(this);

  constructor(wsUrl: string) {
    const socket = new WebSocketClient(wsUrl);
    this.socket = new SocketAPI(socket, this);
  }

  close() { this.socket.close(); }

  authenticateSession() {
    
  }
}