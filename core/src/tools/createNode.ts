import chalk from "chalk";
import { prismaInstance } from "../../prisma/instance";
import Password from "../classes/Password";
import { log } from "../lib/logger";

function randStr(length: number): string {
  let result: string[] = [];
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charsLength = chars.length;

  for (let i = 0; i < length; i++) {
    result.push(chars.charAt(Math.floor(Math.random() * charsLength)));
  }

  return result.join("");
}

export default async function main() {
  const args = process.argv.slice(2);
  const nodeName: string = args.join(" ");

  const secret: string = randStr(128);
  const salt: string = randStr(48);
  const hash = Password.hash(secret, {
    overrideSalt: salt,
  });

  if (!nodeName)
    return console.error(
      `[${chalk.red("!!!")}] CANNOT FIND NODE NAME IN COMMAND ARGUMENTS!`,
      "\n",
      "     FORMAT: {COMMAND} {NODE NAME}"
    );

  const nodeData = await prismaInstance.node.create({
    data: {
      name: nodeName,
      secret: hash,
    },
  });

  let divider: string = chalk.gray("=-=-=-=-=-=-=-=-=-=-=-=-=");

  log.status(
    divider,
    "\n",
    "API Node generated successfully!",
    "\n\n",
    "The Secret for the api node will be provided below, this is the secret that the node will use \n",
    "to authenticate with the master process.  Without this secret you will be unable to bring an api \n",
    "node online.  This is the only time you will be able to get this secret, if you lose it, you will \n",
    "not be able to recover it...",
    "\n\n",
    chalk.whiteBright("Node ID:"),
    chalk.redBright(nodeData.id),
    "\n",
    chalk.whiteBright("Node Name:"),
    chalk.redBright(nodeData.name),
    "\n",
    chalk.whiteBright("Node Creation Date:"),
    nodeData.created,
    "\n\n",
    chalk.whiteBright("Node Secret (KEEP SECURE)"),
    chalk.redBright(secret),
    "\n",
    divider
  );
}

main();
