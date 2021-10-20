import { manifestation } from "@duxcore/manifestation";
import { apiManifest } from "./api/manifest";
import { env } from "./util/env";

function main() {  
  const api = manifestation.createServer(apiManifest, {});

  console.log(env)

  api.listen(env.apiServerPort, () => {
    console.log("API Server started.");
  })
}

main();