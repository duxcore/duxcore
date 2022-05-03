import Collection from "@discordjs/collection";
import { blake2sHex } from "blakets";
import { prismaInstance } from "../../prisma/instance";
import ServerMonitorManager from "../classes/ServerMonitorManager";

interface ServerMonitorCreationData {
  name: string; // The name of the monitor
  creator: string; // The id of the creator
  project: string; // The ID of the project
}

export const monitoring = {
  server: {
    async fetch(id: string): Promise<ServerMonitorManager | null> {
      let raw = await prismaInstance.serverMonitoringService.findFirst({
        where: { id },
      });

      if (!raw) return null;
      return new ServerMonitorManager(raw);
    },

    async create({
      name,
      creator,
      project,
    }: ServerMonitorCreationData): Promise<ServerMonitorManager> {
      let rawDat = await prismaInstance.serverMonitoringService.create({
        data: {
          name,
          projectId: project,
          creatorId: creator,
        },
      });

      return new ServerMonitorManager(rawDat);
    },

    async fetchUserMonitors(
      userId: string
    ): Promise<Collection<string, ServerMonitorManager>> {
      let collection = new Collection<string, ServerMonitorManager>();

      let monitors = await prismaInstance.serverMonitoringService.findMany({
        where: {
          creatorId: userId,
        },
      });

      monitors.map((monitor) =>
        collection.set(monitor.id, new ServerMonitorManager(monitor))
      );

      return collection;
    },

    async count(): Promise<number> {
      return await prismaInstance.serverMonitoringService.count();
    },
  },
};
