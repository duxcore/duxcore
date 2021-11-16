import { manifestation } from "@duxcore/manifestation";
import { apiManifest } from "./api/manifest";
import cluster from 'cluster';
import process from 'process';
import { config } from "dotenv";
import { users } from "./lib/users";

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
