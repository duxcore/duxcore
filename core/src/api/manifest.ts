import { manifestation } from "@duxcore/manifestation";
import { teapot } from "./routes/teapot";

export const apiManifest = manifestation.newManifest({
  routes: [ teapot ],
  versions: [
    {
      version: 1,
      routes: [ teapot ]
    }
  ]
})