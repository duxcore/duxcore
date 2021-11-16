import { ServiceCollection } from "@prisma/client";

export default class ServiceCollectionManager {

  private _rawData: ServiceCollection;

  constructor(rawData: ServiceCollection) {
    this._rawData = rawData;
  }

  toJson() {
    return {
      id: this._rawData.id,
      name: this._rawData.name,
      creator: this._rawData.creatorId,
      created: this._rawData.created,
      lastUpdated: this._rawData.upatedAt,
    }
  }

}