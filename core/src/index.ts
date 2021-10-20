import { manifestation } from "@duxcore/manifestation";
import { apiManifest } from "./api/manifest";

function main() {
  const api = manifestation.createServer(apiManifest, {});

  api.listen(40765, () => {
    console.log("API Server started.");
  })
}

main();