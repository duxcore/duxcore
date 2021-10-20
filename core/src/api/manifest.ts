import { manifestation } from "@duxcore/manifestation";
import { apiLimiter } from "./middleware/rateLimit";
import { teapot } from "./routes/teapot";
import cors from 'cors'

export const apiManifest = manifestation.newManifest({
  routes: [ teapot ],
  middleware: [ cors() ],
  versions: [
    {
      version: 1,
      middleware: [ apiLimiter ],
      routes: [ teapot ]
    }
  ]
})