import { prismaInstance } from "../../prisma/instance";
import DaemonRegionManager from "../classes/DaemonRegionManager";

interface NewRegionData {
  name: string;
  code: string;
}

export const daemonRegions = {
  async fetch(id: string): Promise<DaemonRegionManager | null> {
    let rawData = await prismaInstance.daemonRegion.findFirst({
      where: {
        id,
      },
    });

    if (!rawData) return null;
    return new DaemonRegionManager(rawData);
  },

  async create({ name, code }: NewRegionData): Promise<DaemonRegionManager> {
    let newRegion = await prismaInstance.daemonRegion.create({
      data: { name, code },
    });

    return new DaemonRegionManager(newRegion);
  },

  async checkCodeAvailable(code: string): Promise<boolean> {
    let data = await prismaInstance.daemonRegion.findFirst({
      where: {
        code,
      },
    });

    return !data;
  },

  async exists(id: string): Promise<boolean> {
    let raw = await prismaInstance.daemonRegion.findFirst({ where: { id } });

    return !!raw;
  },
};
