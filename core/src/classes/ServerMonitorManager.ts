import { ServerMonitoringService } from "@prisma/client";
import { serviceCollection } from "../lib/serviceCollections";
import { users } from "../lib/users";
import ServiceCollectionManager from "./ServiceCollectionManager";
import UserManager from "./UserManager";

export default class ServerMonitorManager {

  private _raw: ServerMonitoringService;

  constructor(raw: ServerMonitoringService) {
    this._raw = raw;
  }

  get id(): string { return this._raw.id; }
  get name(): string { return this._raw.name }
  get secret(): string { return this._raw.secret }

  get creatorId(): string { return this._raw.creatorId }
  get creator(): Promise<UserManager> {
    return users.fetch(this._raw.creatorId) as Promise<UserManager>
  }

  get collectionId(): string { return this._raw.collectionId }
  get collection(): Promise<ServiceCollectionManager> {
    return serviceCollection.fetch(this._raw.collectionId) as Promise<ServiceCollectionManager>
  }


  toJson() {
    return {
      id: this.id,
      name: this.name,
      creatorId: this.creatorId,
      collectionId: this.collectionId
    }
  }

}