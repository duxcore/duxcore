import { w3cwebsocket as WebSocketClient, connection } from "websocket"

export default class Wrapper {
  public socket: WebSocketClient;

  constructor(wsUrl: string) {
    this.socket =  new WebSocketClient(wsUrl);
    
    this.socket.onerror = (err) => {
      throw err;
    }
  }

  authenticateSession() {
    
  }
}