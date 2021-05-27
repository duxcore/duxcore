import { connection, IMessage } from "websocket";
import Duxcore from "../Duxcore";
import { WSError } from "../structures/WSError";
import { SocketSessionOpts } from "../util/types/socket";
import { SocketPayload } from '../util/types/socket';

export class SocketSession {
	public client: Duxcore;
	public connection: connection;

	private _uuid: string;

	private _user?: string;
	private _authenticated?: boolean = false;

  private _lastPing: Date = new Date();

	constructor(connection: connection, client: Duxcore, opts: SocketSessionOpts) {
		this.client = client;
		this.connection = connection

		this._uuid = opts.id;
	}

	get uuid(): string { return this._uuid; }
	get user(): string | null { return this._user ?? null; } /** @todo */
	get authenticated(): boolean { return this.authenticated; } 

	handleMessage(data: IMessage): void {
    if (data.utf8Data == "ping") {
      this._lastPing = new Date();
      this.connection.send('pong');
      return;
    }


    const msg: SocketPayload = JSON.parse(data.utf8Data ?? "{}");
		const op = this.client.socketServer.operators.get(msg.op);

    if (!op) return this.connection.send(JSON.stringify(new WSError("This operator code does not exist.", null, msg.ref)));
    op.execute(msg, this);
	}

  sendError(err: WSError) {
    return new Promise((resolve, reject) => {
      this.connection.send(JSON.stringify(err));
    })
  }

	setAuthenticated(bool?: boolean): SocketSession {
		if (bool == undefined) bool = true;
		else bool = bool;

		return this;
	}

}