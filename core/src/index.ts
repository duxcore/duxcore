import { manifestation } from "@duxcore/manifestation";
import { apiManifest } from "./api/manifest";
import { config } from "dotenv";
import cluster from "cluster";
import process from "process";
import io from "socket.io-client";

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

  // Connection error with master process
  socket.on("connect_error", (err) => {
    console.log(err instanceof Error);
    console.log(err.message);

    setTimeout(() => socket.connect(), 500);
  });

  // Get the Node Instance Data
  socket.on("node_instance", (data) => {
    console.log(data);
  });

  // Start An API Worker
  socket.on("startApiWorker", async ({ id, port }, cb) => {
    const fork = cluster.fork({
      id,
      port,
      purpose: WorkerPurpose.API_SERVER,
    });
    fork.on("online", () => {
      cb(fork.process.pid);
    });
  });

  cluster.on("fork", (worker) => {
    worker.on("exit", (code, signal) => {
      socket.emit("worker_exit", worker.process.pid, code, signal);
    });
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

/*
let ports = [7841, 2105, 3609, 8856, 1104]

async function main(port: any) {
  config();
  const api = manifestation.createServer(apiManifest, {});

  api.listen(port, () => {
    console.log(`API Server started on port ${port}.`);
  })
}

if (cluster.isMaster) {

  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < ports.length; i++) {
    let env = {
      port: ports[i],
      server: i
    }

    let worker = cluster.fork(env);
    worker.process['env'] = env;
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    //cluster.fork(worker.process['env']);
  });
} else {
  main(process.env.port)
  console.log(`Worker ${process.pid} started`);
}

//main();
*/
