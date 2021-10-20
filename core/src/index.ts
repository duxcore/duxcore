import { manifestation } from "@duxcore/manifestation";
import { prismaInstance } from "../prisma/instance";
import { apiManifest } from "./api/manifest";
import { env } from "./util/env";

async function main() {
  const api = manifestation.createServer(apiManifest, {});

  await prismaInstance.user.findMany();
  await prismaInstance.userMetaTags.findMany();

  api.listen(env.apiServerPort, () => {
    console.log("API Server started.");
  })
}

main();
