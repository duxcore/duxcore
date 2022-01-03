import { createLogger } from "@lvksh/logger";
import * as chalk from "chalk";

export const log = createLogger(
  {
    debug: chalk.magenta`DEBUG`,
    hcaptcha: chalk.cyan`CAPTCHA`,
    user: chalk.cyan`USER`,
    status: chalk.green`STATUS`,
    websocket: chalk.yellow`SOCKET`,
    auth: chalk.red`AUTH`,
    error: chalk.bgRed.white.bold`ERROR`,
    worker: chalk.gray`WORKER`,
  },
  {
    divider: chalk.gray` | `,
  }
);
