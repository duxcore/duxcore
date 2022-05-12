import { Daemon } from "@prisma/client";
import { prismaInstance } from "../../prisma/instance";
import DaemonManager from "../classes/DaemonManager";
import { daemonRegions } from "./daemonRegions";

export interface NewDaemonData {
  name: string;
  host: string;
  port: number;
  wsPort: string;
  secure: boolean;
  secret: string;
  regionId: string;
  regionDiscriminator: string;
  resourceCeil: {
    cpu: number; // How much of the cpu can the dameon use at max load
    memory: number; // How much memory can the daemon take at max load
    disk: number; // How much disk space can the daemon use.
  };
}

export const daemons = {
  async exists(id: string) {
    return !!(await prismaInstance.daemon.findFirst({
      where: { OR: [{ id }, { code: id }] },
    }));
  },

  async fetch(id: string): Promise<DaemonManager | null> {
    const daemonData = await prismaInstance.daemon.findFirst({
      where: { OR: [{ id }, { code: id }] },
    });

    return daemonData !== null ? new DaemonManager(daemonData) : null;
  },

  async create({
    name,
    host,
    port,
    wsPort,
    secure,
    secret,
    regionId,
    regionDiscriminator,
    resourceCeil: { cpu, memory, disk },
  }: NewDaemonData): Promise<DaemonManager> {
    const newDaemon = await prismaInstance.daemon
      .create({
        data: {
          code: `${
            (
              await daemonRegions.fetch(regionId)
            )?.code
          }-${regionDiscriminator}`,
          name,
          host,
          port: port.toString(),
          wsPort,
          secure,
          secret,
          regionId,
          cpuCeil: cpu,
          memCeil: memory,
          diskCeil: disk,
          regionDiscriminator,
        },
      })
      .catch((err) => {
        throw err;
      });

    return new DaemonManager(newDaemon);
  },

  async apiPatch(id, data: Partial<Daemon>) {
    let dat = await prismaInstance.daemon.update({
      data,
      where: { id: (await this.fetch(id))?.id },
    });

    return new DaemonManager(dat);
  },

  async regionDiscriminatorInUse(
    discrim: string,
    region: string
  ): Promise<boolean> {
    const fetchDiscriminator = await prismaInstance.daemon.findFirst({
      where: {
        regionDiscriminator: discrim,
        AND: {
          regionId: region,
        },
      },
    });

    return !!fetchDiscriminator;
  },

  async secretInUse(secret): Promise<boolean> {
    const fetchSecret = await prismaInstance.daemon.findFirst({
      where: { secret },
    });

    return !!secret;
  },
};
