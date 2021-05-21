import Duxcore from "../Duxcore";
import { Server } from "socket.io";
import express from 'express';
import http from "http";

export class WebSocketServer {

	public client: Duxcore;
	public io?: Server;

	constructor(client: Duxcore) {
		this.client = client;
	}

	start(port: number): Promise<WebSocketServer> {
		return new Promise((resolve, reject) => {
			const app = express();
			const server = http.createServer(app);
			const io = new Server(server);

			this.io = io;
			
			server.listen(port, () => {
				
			});
		});
	}

}