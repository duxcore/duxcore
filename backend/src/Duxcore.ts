import { config as dtCfg } from 'dotenv'
import { SessionServer } from './classes/SessionServer';
import keypair from 'keypair';

export default class Duxcore {
	
	public sessions: SessionServer = new SessionServer(this);
	public tmpKeypair = keypair();

	private sessionServerAddress = process.env.SESSION_REDIS_ADDRESS;
	private wsPort = process.env.WS_PORT;

	constructor() {
		dtCfg();
	}
	
	randStr(length: number): string {
		let result = "";
		let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		let charsLength = chars.length;
	
		for (let i = 0; i < length; i++) {
			result += chars.charAt(Math.floor(Math.random() * charsLength));
		}
	
		return result;
	}

	start(): Promise<Duxcore> {
		return new Promise(async (resolve, reject) => {
			await this.sessions.start(this.sessionServerAddress ?? "");
			resolve(this);
		});
	}
}