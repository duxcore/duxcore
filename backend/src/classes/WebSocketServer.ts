import Duxcore from "../Duxcore";
import http from "http";
import { server as WSServer } from 'websocket'
import { WebsocketMessageObject } from '../structures/WSMessageObject';
import { WSError } from "../structures/WSError";
export class WebSocketServer {

	public client: Duxcore;
	public wsServer?: WSServer;

	public static currentApiVersion: string = "0.1.0";

	constructor(client: Duxcore) {
		this.client = client;
	}


	start(port: number | string): Promise<WebSocketServer> {
		return new Promise((resolve, reject) => {
			let server = http.createServer((req, res) => {
				res.writeHead(404);
				res.end();
			});

			server.listen(port, () => {
				console.log(`Socket Server now listening on port`, port);
				resolve(this);
			});

			this.wsServer = new WSServer({
				httpServer: server,
				autoAcceptConnections: false
			});

			this.wsServer.on('request', (request) => {
				const testOrigin = this.testOrigin(request.origin);
				if (!testOrigin) return request.reject(403, "Request of this origin are prohibited!");

				const connection = request.accept();
				connection.on('message', data => {
					console.log(data);
				});

				console.log("Socket connection established...");

				connection.on("close", (code, desc) => {
					console.log("Socket connection closed:", code, desc);
				});
			});
		});


	}

	private testOrigin(origin: string): boolean {
		return true;
	}
}