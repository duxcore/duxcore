import trixi from "trixi";
import http from 'http';
import * as wsm from '../ws/manifest';

export default function startWs(port: number) {
  const httpServer = new http.Server()
  const app = trixi();
  const wsManifest = wsm.default
  httpServer.listen(port, () => {
    console.log('Socket webserver started on port', port)
    const server = app.createServer({ httpServer });
  
    server.onConnection(connection => {
      console.log("A new socket connection has been established from", connection.remoteAddress);

      Object.keys(wsManifest).map(key => {
        connection.onOp(key, wsManifest[key]);
      });
    });
  });
}