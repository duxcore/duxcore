import { connection, IMessage } from "websocket";
import Duxcore from "../Duxcore";
import { WSError } from "../structures/WSError";
import { SocketSessionOpts } from "../util/types/socket";
import { SocketPayload } from '../util/types/socket';
import jwt from "jsonwebtoken";
import SocketPayloadController from "../controllers/SocketPayloadController";
import { SessionController } from "../controllers/SessionController";

enum AuthMethod {
  SESSION
}

export class SocketSession {
	public client: Duxcore;
	public connection: connection;

	private _uuid: string;

	private _user?: string;
  private _session?: SessionController;

	private _authenticated?: boolean = false;
  private _authMethod?: AuthMethod;

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
    const payload: SocketPayloadController = new SocketPayloadController(this.client, this, msg)
		const op = this.client.socketServer.operators.get(msg.op);

    if (!op) return this.connection.send(JSON.stringify(new WSError("This operator code does not exist.", null, msg.ref)));
    op.execute(payload, this);
	}

  sendError(err: WSError) {
    return new Promise((resolve, reject) => {
      this.connection.send(JSON.stringify(err));
    })
  }

  authenticate(token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.client.tmpKeypair.private, { algorithms: [ "RS512" ] }, async (err, decoded: any) => {
        if (err) return reject(err.message);

        const data = decoded['data'];
        const method = data['method'];

        switch (method) {

          case "session":
            const sid = data['session_id'];
            const session = await this.client.sessions.get(sid);

            if (!sid || !session) return reject('Missing or invalid session ID');
            
            this._session = session;
            this._authMethod = AuthMethod.SESSION;

            // ... Addational session logic here

            resolve(true);
          break;

          default: return reject('Invalid session authentication method'); break;                                                                                                               
        }

      });
    });
  }
}