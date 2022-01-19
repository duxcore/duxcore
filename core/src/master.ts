import Collection from "@discordjs/collection";
import { prisma } from "@prisma/client";
import chalk from "chalk";
import { randomUUID } from "crypto";
import { config } from "dotenv";
import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { NodeStatusObject } from ".";
import { prismaInstance } from "../prisma/instance";
import Password from "./classes/Password";

export default function main() {
  config();

  const app = express();
  const server = http.createServer(app);
  const io = new Server(server);
  let ports = [7841, 2105, 3609, 8856, 1104];

  const logMessage = (scope: string, ...args) =>
    console.log(`[ ${chalk.green(scope)} ]`, ...args);

  const activeNodeInstances = new Collection<
    string,
    ReturnType<typeof createNodeInstace>
  >();

  const createNodeInstace = (id: string, name: string, socket: Socket) => {
    return {
      id,
      name,
      opened: new Date(),
      instances: new Collection<string, NodeStatusObject>(),
      startApiWorker(port: number) {
        return new Promise<NodeStatusObject>((res, _rej) => {
          let id = randomUUID();
          socket.emit(
            "startApiWorker",
            { id, port },
            (instance: NodeStatusObject) => {
              this.instances.set(id, instance);
              res(instance);

              console.log(
                `[ ${chalk.green(this.name)} ] API Worker`,
                instance.worker.pid,
                `has started with port`,
                instance.port,
                `on node`,
                chalk.redBright(this.id)
              );

              socket.emit("node_instance", this);
            }
          );
        });
      },
      fetchWorkers(): Promise<NodeStatusObject[]> {
        return new Promise((res, rej) => {
          socket.emit("fetchWorkers", (status: NodeStatusObject[]) =>
            res(status)
          );
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

    logMessage(
      node.name,
      chalk.redBright(`(${node.id})`),
      "Successfully Authenticated!"
    );
    return next();
  });

  io.on("connection", async (socket) => {
    let nodeId = socket.handshake.auth["id"];
    let rawNodeData = await prismaInstance.node.findFirst({
      where: { id: nodeId },
    });

    if (!rawNodeData) return socket.disconnect();

    const node = createNodeInstace(nodeId, rawNodeData.name, socket);
    activeNodeInstances.set(node.id, node);

    const activePorts = (await node.fetchWorkers()).map((v) => v.port);

    ports.map(async (port) => {
      if (!activePorts.includes(port)) node.startApiWorker(port);
    });

    socket.emit("node_instance", node);
    socket.on("worker_exit", (pid) => {});

    console.log("Node Instance Connected!");
  });

  server.listen(49758, () => {
    console.log("Master Node Process API started on port", 49758);
  });
}

main();
