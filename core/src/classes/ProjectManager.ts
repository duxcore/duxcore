import type { Project } from "@prisma/client";

export default class ProjectManager {
  private _rawData: Project;

  constructor(rawData: Project) {
    this._rawData = rawData;
  }

  get id(): string {
    return this._rawData.id;
  }

  toJson() {
    return {
      id: this._rawData.id,
      name: this._rawData.name,
      creator: this._rawData.creatorId,
      created: this._rawData.created,
      lastUpdated: this._rawData.updatedAt,
    };
  }
}
