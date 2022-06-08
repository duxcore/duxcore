import Collection from "@discordjs/collection";
import { Project } from "@prisma/client";
import { prismaInstance } from "../../prisma/instance";

export default class ProjectManager {
  private _rawData: Project;

  constructor(rawData: Project) {
    this._rawData = rawData;
  }

  get id(): string {
    return this._rawData.id;
  }

  async toJson() {
    return {
      id: this._rawData.id,
      name: this._rawData.name,
      creator: this._rawData.creatorId,
      created: this._rawData.created,
      lastUpdated: this._rawData.upatedAt,
    };
  }
}
