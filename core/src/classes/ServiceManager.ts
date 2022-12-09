import type { Service, Prisma } from "@prisma/client";
import { daemons } from "../interfaces/daemons";

export default class ServiceManager {
  private _rawData: Service;

  public id: string;

  public name: string;
  public project: string;
  public daemon: string;
  public params: Prisma.JsonValue;
  public cpu: number;
  public memory: number;
  public disk: number;
  public status: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(rawData: Service) {
    this._rawData = rawData;

    this.id       = this._rawData.id;
    this.name     = this._rawData.name;
    this.project  = this._rawData.projectId;
    this.daemon   = this._rawData.daemonId;
    this.params   = this._rawData.params;
    this.cpu      = this._rawData.cpu;
    this.memory   = this._rawData.mem;
    this.disk     = this._rawData.disk;
    this.status   = this._rawData.status
    this.createdAt= this._rawData.createdAt;
    this.updatedAt= this._rawData.updatedAt;
  }

  async attach(onMessage: (message: Buffer) => {}) {
    return (await daemons.fetch(this.daemon))?.server.attachToService(this.id, onMessage);
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      project: this.project,
      daemon: this.daemon,
      params: this.params,
      cpu: this.cpu,
      memory: this.memory,
      disk: this.disk,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
