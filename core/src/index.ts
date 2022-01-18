import { manifestation } from "@duxcore/manifestation";
import { apiManifest } from "./api/manifest";
import { config } from "dotenv";
import cluster, { Worker } from "cluster";
import process from "process";
import io from "socket.io-client";
import Collection from "@discordjs/collection";

config();

enum WorkerPurpose {
  API_SERVER = "api_server",
  TASK_EXECUTOR = "task_executor",
}

if (cluster.isPrimary) {
  console.log(`Primary Process`, process.pid, "is now running!");

  let socket = io(process.env.MASTER_SERVER ?? "", {
    auth: {
      id: process.env.NODE_ID,
      secret: process.env.NODE_SECRET,
    },
    autoConnect: true,
    reconnection: true,
  });

  const activeInstances = new Collection<
    string,
    ReturnType<typeof createInstanceObject>
  >();

  const createInstanceObject = (
    worker: Worker,
    data: {
      id: string;
      port: string;
      autoRevive?: boolean;
    }
  ) => {
    let object = {
      id: data.id,
      port: data.port,
      isOnline: true,
      worker,
      setOnline(online: boolean): boolean {
        if (this.isOnline == online) return this.isOnline;
        this.isOnline = online;

        return this.isOnline;
      },
      onExit(): Promise<{
        code: number;
        signal: string;
        worker: Worker;
      }> {
        return new Promise((res, rej) => {
          worker.on("exit", (code, signal) => {
            return res({
              signal,
              code,
              worker,
            });
          });
        });
      },
      toJson() {
        return {
          id: this.id,
          port: this.port,
          isOnline: this.isOnline,
          worker: {
            pid: worker.process.pid,
          },
        };
      },
    };

    worker.on("exit", (code, signal) => {
      object.setOnline(false);
    });

    worker.on("online", () => {
      object.setOnline(true);
    });

    return object;
  };

  const startApiWorker = (id, port) => {
    const fork = cluster.fork({
      id,
      port,
      purpose: WorkerPurpose.API_SERVER,
    });
    fork.on("online", () => {
      const instance = createInstanceObject(fork, { id, port });
      activeInstances.set(instance.id, instance);
    });
  };

  // Connection error with master process
  socket.on("connect_error", (err) => {
    console.log(err instanceof Error);
    console.log(err.message);

    setTimeout(() => socket.connect(), 500);
  });

  // Get the Node Instance Data
  socket.on("node_instance", console.log);

  // Master Request an index of the workers
  socket.on("fetchWorkers", async (cb) =>
    cb(await activeInstances.map((v) => v.toJson()))
  );

  // Start An API Worker
  socket.on("startApiWorker", async ({ id, port }, cb) => {
    startApiWorker(id, port);
  });
} else {
  if (WorkerPurpose.API_SERVER == process.env.purpose) {
    config();
    const api = manifestation.createServer(apiManifest, {});
    const port = process.env.port;

    api.listen(port, () => {
      console.log(
        `Worker`,
        process.pid,
        `has started an api server on port`,
        port
      );
      if (!process.send) return;
    });
  }
}
