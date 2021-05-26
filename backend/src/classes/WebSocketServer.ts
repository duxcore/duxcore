import Duxcore from "../Duxcore";
import http from "http";
import { server as WSServer } from 'websocket'
import * as uuid from 'uuid';
import { SocketSession } from "./SocketSession";
import Collection from "@discordjs/collection";
import { glob } from "glob";
import WSOperator from "../structures/WSOperator";

export class WebSocketServer {

  public client: Duxcore;
  public wsServer?: WSServer;

  public commections: Collection<string, SocketSession> = new Collection();
  public operators: Collection<string, WSOperator> = new Collection();

  private opsDir: string = `${__dirname}/../socket/opCodes`;

  constructor(client: Duxcore) {
    this.client = client;
  }

  registerOperators(dir: string): Promise<void> {
    return new Promise((resolve, _r) => {
      const ext = (__filename.endsWith("ts") ? "ts" : "js");
      glob(`${dir}/**/op.*.${ext}`, (err, matches) => {
        if (err) throw err;
        if (matches.length == 0) return;
        matches.map((file, index) => {
          const operator: WSOperator = require(file).default;
          if (!operator.enabled) return;
          return this.operators.set(operator.opCode, operator);
        });
        resolve();
      });
    })
  }


  start(port: number | string): Promise<WebSocketServer> {
    return new Promise((resolve, reject) => {
      let server = http.createServer((req, res) => {
        res.writeHead(404);
        res.end();
      });

      server.listen(port, async () => {
        console.log(`Socket Server now listening on port`, port);
        await this.registerOperators(this.opsDir);
        resolve(this);
      });

      this.wsServer = new WSServer({
        httpServer: server,
        autoAcceptConnections: false
      });

      this.wsServer.on('request', (request) => {
        const testOrigin = this.testOrigin(request.origin);
        if (!testOrigin) return request.reject(403, "Request of this origin are prohibited!");

        const sid = uuid.v4();
        const connection = request.accept();
        const session = new SocketSession(connection, this.client, { id: sid });

        connection.on('message', data => {
          session.handleMessage(data);
        });

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