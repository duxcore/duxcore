import { ApiManifest } from "../types/api";
import { teapot } from "./routes/teapot";

export const apiManifest: ApiManifest = {
  versions: [
    {
      version: 1,
      middleware: [],
      routes: [],
    },
    {
      version: 69,
      middleware: [],
      routes: [teapot],
    },
  ],
};
