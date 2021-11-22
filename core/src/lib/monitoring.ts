import { blake2sHex } from "blakets";
import { prismaInstance } from "../../prisma/instance";
import ServerMonitorManager from "../classes/ServerMonitorManager";

interface ServerMonitorCreationData {
  name: string; // The name of the monitor
  creator: string // The id of the creator
  collection: string // The ID of the collection
}

export const monitoring = {
  server: {
    async fetch(id: string): Promise<ServerMonitorManager | null> {
      let raw = await prismaInstance.serverMonitoringService.findFirst({
        where: { id }
      });

      if (!raw) return null;
      return new ServerMonitorManager(raw);
    },

    async create({ name, creator, collection }: ServerMonitorCreationData): Promise<ServerMonitorManager> {
      let rawDat = prismaInstance.serverMonitoringService.create({
        data: {
          name,
          collectionId: collection,
          creatorId: creator
        }
      });

      return rawDat;
    },

    async delete(id: string): Promise<void> { },

    async count(): Promise<number> {
      return await prismaInstance.serverMonitoringService.count();
    }
  }
}