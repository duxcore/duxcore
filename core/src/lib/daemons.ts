import { prismaInstance } from "../../prisma/instance";
import DaemonManager from "../classes/DaemonManager";

export interface NewDaemonData {
  name: string;
  host: string;
  port: number;
  secret: string;
}

export const daemons = {
  async fetch(id: string): Promise<DaemonManager | null> {
    const daemonData = await prismaInstance.daemon.findFirst({
      where: { id },
    });

    return daemonData !== null ? new DaemonManager(daemonData) : null;
  },

  async create({
    name,
    host,
    port,
    secret,
  }: NewDaemonData): Promise<DaemonManager> {
    const newDaemon = await prismaInstance.daemon
      .create({
        data: {
          name,
          host,
          port: port.toString(),
          secret,
        },
      })
      .catch((err) => {
        throw err;
      });

    return new DaemonManager(newDaemon);
  },

  async secretInUse(secret): Promise<boolean> {
    const fetchSecret = await prismaInstance.daemon.findFirst({
      where: { secret },
    });

    return !!secret;
  },
};
