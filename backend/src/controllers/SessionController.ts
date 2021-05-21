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

	get x_csrf(): string {
		return this._x_csrf;		
	}

	get sessionClient() {
		return this._sessionClient
	}

	get sessionIp() {
		return this._sessionIp;
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