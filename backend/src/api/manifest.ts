import { ApiManifest } from "../types/api";
import { teapot } from "./routes/teapot";
import { getUsername } from "./routes/user/getUsername";
import cors from 'cors'

export const apiManifest: ApiManifest = {
  versions: [
    {
      version: 1,
      middleware: [cors()],
      routes: [
        getUsername
      ],
    },
    {
      version: 69,
      middleware: [],
      routes: [teapot],
    },
  ],
};
