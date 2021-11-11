import Cryptr from "cryptr";
import fs from 'fs'

let secret = fs.readFileSync(`${__dirname}/../../../private.key`).toString();
export const cryptr = new Cryptr(secret)