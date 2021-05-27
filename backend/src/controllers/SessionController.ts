import { SessionDataObject, SessionObject } from "../util/types/sessions";
import jwt from "jsonwebtoken";
import Duxcore from "../Duxcore";

export class SessionController {
	public id: string;
	public client: Duxcore;
	private raw: SessionObject;

	private _x_csrf: string;
	private _sessionClient: string;
	private _sessionIp: string;

	private _sessionData: SessionDataObject;

	public algo: string = 'RS512';

	constructor(sessionId: string, raw: SessionObject, client: Duxcore) {
		this.id = sessionId;
		this.client = client;
		this.raw = raw;

		this._x_csrf = raw.x_csrf;
		this._sessionClient = raw.attached_client;
		this._sessionIp = raw.attached_ip

		this._sessionData = raw.data;
	}

	get x_csrf(): string { return this._x_csrf; }

	get sessionClient(): string { return this._sessionClient; }

	get sessionIp(): string { return this._sessionIp; }

  toJson(asString?: boolean) {
    const object = {
      session_id: this.id,
      x_csrf: this._x_csrf,
      client: this._sessionClient,
      ip: this._sessionIp
    }

    if (!asString) return object;
    else return JSON.stringify(object);
  }

	generateJWT() {
		const data = {
			user: this._sessionData.user,
			flags: []
		}
		
		const token = jwt.sign({ data }, this.client.tmpKeypair.private, { algorithm: "RS512", expiresIn: "10s" });
		return token;
	}

}