import trixi from "trixi";
import http from "http";
import * as wsm from "../ws/manifest";
import SocketConnection from "../classes/SocketConnection";

export default function startWs(port: number) {
  const httpServer = new http.Server();
  const app = trixi();
  const wsManifest = wsm.default;
  httpServer.listen(port, () => {
    console.log("Socket webserver started on port", port);
    const server = app.createServer({ httpServer });

    server.onConnection((connection) => {
      console.log(
        "A new socket connection has been established from",
        connection.remoteAddress
      );

      const instance = new SocketConnection(server, connection);

      Object.keys(wsManifest).map((key) => {
        connection.onOp(key, (payload) => wsManifest[key](payload, instance));
        console.log("registered op", key)
      });
    });
  });
}
