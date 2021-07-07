import { ApiManifest } from "../types/api";
import { teapot } from "./routes/teapot";
import cors from "cors";
import { apiLimiter } from "../helpers/rateLimit";
import { users } from "./routes/user/users";
import bodyParser from "body-parser";
import { username } from "./routes/user/getUsername";

export const apiManifest: ApiManifest = {
  versions: [
    {
      version: 1,
      middleware: [cors(), apiLimiter, bodyParser.json()],
      routes: [...username, teapot, ...users],
    },
  ],
};
