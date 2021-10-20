import { manifestation } from "@duxcore/manifestation";
import { apiLimiter } from "./middleware/rateLimit";
import { teapot } from "./routes/teapot";
import cors from 'cors'
import { apiStatus } from "./routes/status";

export const apiManifest = manifestation.newManifest({
  middleware: [cors()],
  versions: [
    {
      version: 1,
      middleware: [apiLimiter],
      routes: [teapot, apiStatus]
    }
  ]
})