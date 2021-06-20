import { ApiManifest } from "../types/api";
import { teapot } from "./routes/teapot";

export const apiManifest: ApiManifest = {
  versions: [
    {
      version: 1,
      middleware: [],
      routes: [teapot],
    },
  ],
};
