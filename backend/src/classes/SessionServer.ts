import Duxcore from "../Duxcore";
import * as redis from 'redis';
import { SessionController } from "../controllers/SessionController";
import { NewSessionOpts, SessionDataObject, SessionObject } from "../util/types/sessions";

export class SessionServer {

	public client: Duxcore;
	public redis: redis.RedisClient | null = null;
	public started?: boolean = false;

	constructor(client: Duxcore) {
		this.client = client
	}

	start(redisAddress: string): Promise<SessionServer> {
		return new Promise(async (resolve, reject) => {
		  this.redis = await redis.createClient(redisAddress);
			resolve(this);
		});
	}
	
	get(sessionId): Promise<SessionController | null> {
		return new Promise((resolve, reject) => {
			if (!redis) return reject('Redis server not connected...');
			this.redis?.get(sessionId, (err, res) => {
				if (err) throw err;
				if (res == null) return resolve(null);

				const json = JSON.parse(res);
				return resolve(new SessionController(sessionId, json, this.client));
			})
		});
	}

	new(dat: NewSessionOpts): Promise<SessionController> {
		return new Promise((resolve, reject) => {
			if (!redis) return reject('Redis server not connected...');
			let x_csrf = this.generateCsrf();
			let sessionId = this.client.randStr(128);
			let expiryTime = ((1000 * 86400) * 7);

			let newSessionObject: SessionObject = {
				x_csrf,
				attached_client: dat.client,
				attached_ip: dat.ip,
				created: new Date(),
				expires: new Date(new Date().getTime() + expiryTime),
				data: dat.data ?? this.generateBlankSessionData()
			}

			this.redis?.set(sessionId, JSON.stringify(newSessionObject), (err, res) => {
				if (err) return reject(err);
				return resolve(new SessionController(sessionId, newSessionObject, this.client));
			})
		});
	}

	private generateCsrf(): string {
		let x_csrf = this.client.randStr(64);
		return x_csrf;
	}

	private generateBlankSessionData(): SessionDataObject {
		return 	{
			user: null
		}
	}
}