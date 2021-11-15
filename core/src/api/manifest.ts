import { manifestation } from "@duxcore/manifestation";
import { apiLimiter } from "./middleware/rateLimit";
import { teapot } from "./routes/teapot";
import cors from 'cors'
import { apiStatus } from "./routes/status";
import bodyParser from "body-parser";
import { authRoutes } from "./routes/auth";
import { resetEmail } from "./routes/resetEmail";
import { apiUsersRouter } from "./routes/users";

export const apiManifest = manifestation.newManifest({
  middleware: [cors(), bodyParser.json()],
  versions: [
    {
      version: 1,
      middleware: [apiLimiter, cors()],
      routes: [teapot, apiStatus, ...authRoutes, resetEmail],
      routers: [apiUsersRouter]
    }
  ]
})