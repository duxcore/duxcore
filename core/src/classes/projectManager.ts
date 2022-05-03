import Collection from "@discordjs/collection";
import { Project } from "@prisma/client";
import { prismaInstance } from "../../prisma/instance";
import ServerMonitorManager from "./ServerMonitorManager";

export default class ProjectManager {
  private _rawData: Project;

  constructor(rawData: Project) {
    this._rawData = rawData;
  }

  get id(): string {
    return this._rawData.id;
  }

  get monitors(): Promise<Collection<string, ServerMonitorManager>> {
    return (async () => {
      const monitorCollection = new Collection<string, ServerMonitorManager>();

      (
        await prismaInstance.serverMonitoringService.findMany({
          where: {
            projectId: this.id,
          },
        })
      ).map((srvMonitor) =>
        monitorCollection.set(
          srvMonitor.id,
          new ServerMonitorManager(srvMonitor)
        )
      );

      return monitorCollection;
    })();
  }

  async toJson() {
    return {
      id: this._rawData.id,
      name: this._rawData.name,
      creator: this._rawData.creatorId,
      created: this._rawData.created,
      lastUpdated: this._rawData.upatedAt,
      monitors: await (await this.monitors).map((monitor) => monitor.toJson()),
    };
  }
}
