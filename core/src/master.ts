import Collection from "@discordjs/collection";
import chalk from "chalk";
import { randomUUID } from "crypto";
import { config } from "dotenv";
import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { prismaInstance } from "../prisma/instance";
import Password from "./classes/Password";
import { log } from "./lib/logger";

export default function main() {
  config();

  const app = express();
  const server = http.createServer(app);
  const io = new Server(server);

  const createNodeInstace = (nodeId: string, name: string, socket: Socket) => {
    return {
      nodeId,
      name,
      opened: new Date(),
      processes: new Collection<string, NodeProcessData>(),
      startApiWorker(port: number) {
        return new Promise<NodeProcessData>((res, _rej) => {
          let id = randomUUID();
          socket.emit("startApiWorker", { id, port }, (pid: string) => {
            let process: NodeProcessData = {
              id,
              pid,
              port,
              started: new Date(),
              node: this.nodeId,
            };

            this.processes.set(id, process);
            res(process);

            log.worker(
              `[ ${chalk.green(this.name)} ] API Worker`,
              process.pid,
              `has started with port`,
              process.port,
              `on node`,
              chalk.redBright(this.nodeId)
            );

            socket.emit("node_instance", this);
          });
        });
      },
    };
  };

  io.use(async (socket, next) => {
    const errors = {
      missingSecret: new Error(
        "Secret is missing from authentication query..."
      ),
      missingId: new Error(
        "The Node ID is missing from authentication query..."
      ),
      unknownNodeId: new Error("The Node ID provided is invalid..."),
      authFailure: new Error("The secret provided is invalid..."),
    };

    let authSecret = socket.handshake.auth["secret"];
    let nodeId = socket.handshake.auth["id"];

    if (!authSecret) return next(errors.missingSecret);
    if (!nodeId) return next(errors.missingSecret);

    const node = await prismaInstance.node.findFirst({
      where: { id: nodeId },
    });
    if (!node) return next(errors.unknownNodeId);

    const isAuthenticated = Password.validate(authSecret, node.secret);
    if (!isAuthenticated) return next(errors.authFailure);

    log.worker(
      node.name,
      chalk.redBright(`(${node.id})`),
      "Successfully Authenticated!"
    );
    return next();
  });

  io.on("connection", async (socket) => {
    let ports = [7841, 2105, 3609, 8856, 1104];
    let nodeId = socket.handshake.auth["id"];
    let rawNodeData = await prismaInstance.node.findFirst({
      where: { id: nodeId },
    });

    if (!rawNodeData) return socket.disconnect();

    const node = createNodeInstace(nodeId, rawNodeData.name, socket);

    ports.map((port) => {
      node.startApiWorker(port);
    });

    socket.emit("node_instance", node);
    socket.on("worker_exit", (pid) => {});

    log.worker("Node Instance Connected!");
  });

  server.listen(49758, () => {
    log.status("Master Node Process API started on port", 49758);
  });
}

main();

interface NodeProcessData {
  id: string;
  pid: string;
  port: number;
  started: Date;
  node: string;
}
