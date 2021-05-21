import Duxcore from "../Duxcore";

export class SocketSession {
	public client: Duxcore;

	constructor(client: Duxcore) {
		this.client = client;
	}

}