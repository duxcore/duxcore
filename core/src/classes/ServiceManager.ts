import type { Service, Prisma } from "@prisma/client";

export default class ServiceManager {
  private _rawData: Service;

  constructor(rawData: Service) {
    this._rawData = rawData;
  }

  get id(): string {
    return this._rawData.id;
  }

  get name(): string {
    return this._rawData.name;
  }

  get project(): string {
    return this._rawData.projectId;
  }

  get daemon(): string {
    return this._rawData.daemonId;
  }

  get params(): Prisma.JsonValue {
    return this._rawData.params;
  }

  get cpu(): number {
    return this._rawData.cpu;
  }

  get memory(): number {
    return this._rawData.mem;
  }

  get disk(): number {
    return this._rawData.disk;
  }

  get status(): string {
    return this._rawData.status;
  }

  get createdAt(): Date {
    return this._rawData.createdAt;
  }
  
  get updatedAt(): Date {
    return this._rawData.updatedAt;
  }

  toJson() {
    return {
      id: this._rawData.id,
      name: this._rawData.name,
      project: this._rawData.projectId,
      daemon: this._rawData.daemonId,
      params: this._rawData.params,
      cpu: this._rawData.cpu,
      memory: this._rawData.mem,
      disk: this._rawData.disk,
      status: this._rawData.status,
      createdAt: this._rawData.createdAt,
      updatedAt: this._rawData.updatedAt,
    };
  }
}
