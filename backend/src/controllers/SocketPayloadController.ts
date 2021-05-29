import { SocketSession } from "../classes/SocketSession";
import Duxcore from "../Duxcore";
import { WSError } from "../structures/WSError";
import WSOperator from "../structures/WSOperator";
import WSPayload from "../structures/WSPayload";
import { SocketPayload } from "../util/types/socket";

export default class SocketPayloadController {
  private _client: Duxcore;
  private _socket: SocketSession;
  private _payload: SocketPayload;

  constructor(client: Duxcore, socket: SocketSession, payload: SocketPayload) {
    this._client = client;
    this._socket = socket,
    this._payload = payload;
  }

  get raw(): SocketPayload { return this._payload; }
  get replyCall(): string { return `${this._payload.op}:reply`}

  get op(): string { return this._payload.op; }
  get p(): any { return this._payload.p; }
  get ref(): string { return this._payload.ref; }

  async reply(payload: any): Promise<void> {
    const replyMessageObject = new WSPayload(
      this.replyCall,
      payload,
      this.ref
    ).toString();

    this._socket.connection.send(replyMessageObject);
    return;
  }

  async sendError(message): Promise<void> {
    const errMessageObject = new WSError(
      message,
      this.replyCall,
      this._payload.ref
    ).toString();
    this._socket.connection.send(errMessageObject);
  }
}