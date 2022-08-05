import { manifestation } from "@duxcore/manifestation";
import { apiManifest } from "./api/manifest";
import { config } from "dotenv";
import cluster from "cluster";
import process from "process";
import { createClient } from "redis";
import { randomUUID } from "crypto";
import { client } from "websocket";

config();

async function createRedisConnection() {
  const redis = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  };

  const client = createClient({
    password: redis.password,
    url: `redis://${redis.host}:${redis.port}`,
  });

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();

  return client;
}

export default async function main() {
  const currentMasterDBKey = "current_master";

  const promoteSelfMaster = (
    client: Awaited<ReturnType<typeof createRedisConnection>>,
    uuid: string
  ) => {
    client.set(currentMasterDBKey, uuid, {
      EX: 8,
    });

    let refreshMasterInterval = setInterval(async () => {
      if ((await client.get(currentMasterDBKey)) == uuid)
        client.set(currentMasterDBKey, uuid, {
          EX: 8,
        });
      else clearInterval(refreshMasterInterval);
    }, 7000);
  };
  const beginMasterLifeCycle = async (
    client: Awaited<ReturnType<typeof createRedisConnection>>,
    uuid: string
  ) => {
    // Assign self master if no master is assigned
    if (!(await client.get(currentMasterDBKey)))
      promoteSelfMaster(client, uuid);

    // Start waiting for no master
    if (await client.get(currentMasterDBKey)) {
      let waitNoMasterResponse = setInterval(async () => {
        if (await client.get(currentMasterDBKey)) return;
        else return promoteSelfMaster(client, uuid);
      }, Math.floor(Math.random() * 30000));
    }

    console.log(`Self ID: ${uuid}`);
    console.log(`Current Master: ${await client.get(currentMasterDBKey)}`);
  };
  const isMaster = async (
    client: Awaited<ReturnType<typeof createRedisConnection>>,
    uuid: string
  ) => {
    return (await client.get(currentMasterDBKey)) == uuid;
  };

  if (cluster.isMaster) {
    cluster.fork();

    cluster.on("disconnect", (worker) => {
      cluster.fork(); 
    });
  } else {
    config();

    const coreClientUUID = randomUUID();
    const api = manifestation.createServer(apiManifest, {});
    const port = process.env.CORE_PORT;
    const client = await createRedisConnection();

    beginMasterLifeCycle(client, coreClientUUID);

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

main();
