import { manifestation } from "@duxcore/manifestation";
import { apiLimiter } from "./middleware/rateLimit";
import { teapot } from "./routes/teapot";
import cors from 'cors'
import { apiStatus } from "./routes/status";
import { apiUsers } from "./routes/users";
import bodyParser from "body-parser";

export const apiManifest = manifestation.newManifest({
  middleware: [cors(), bodyParser.json()],
  versions: [
    {
      version: 1,
      middleware: [apiLimiter],
      routes: [teapot, apiStatus, ...apiUsers]
    }
  ]
})