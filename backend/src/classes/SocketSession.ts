import Duxcore from "../Duxcore";

export class SocketSession {
	public client: Duxcore;

	private _user?: string;

	constructor(client: Duxcore) {
		this.client = client;
	}

	get permissions(): String[] {
		return [];
	}

}