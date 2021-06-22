import { ApiManifest } from "../types/api";
import { teapot } from "./routes/teapot";
import { getUsername } from "./routes/user/getUsername";
import cors from "cors";
import { apiLimiter } from "../helpers/rateLimit";

export const apiManifest: ApiManifest = {
  versions: [
    {
      version: 1,
      middleware: [cors(), apiLimiter],
      routes: [getUsername, teapot],
    },
  ],
};
