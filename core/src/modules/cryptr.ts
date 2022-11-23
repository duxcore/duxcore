import Cryptr from "cryptr";
import fs from "fs";

let secret = fs
  .readFileSync(
    `${__dirname}/../..${__filename.endsWith(".ts") ? "" : "/.."}/private.key`
  )
  .toString();
export const cryptr = new Cryptr(secret);
