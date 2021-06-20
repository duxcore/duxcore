import { config } from "dotenv";

config();

import trixi from "trixi";
import startAPI from "./src/lib/apiServer";
import startWs from "./src/lib/wsServer";

function main() {
  const app = trixi();
  const wsPort = parseInt(process.env.WS_PORT ?? "8080");
  const apiPort = parseInt(process.env.API_PORT ?? "7070");

  (() => {
    startWs(wsPort as number);
    startAPI(apiPort);
  })();
}

main();
