import { Daemon } from "@prisma/client";

export default class DaemonManager {
  private _raw: Daemon;
  public readonly id: string;
  public readonly name: string;

  public readonly created: Date;
  public readonly secret: string;

  public readonly host: string;
  public readonly port: string;

  constructor(raw: Daemon) {
    this._raw = raw;

    this.id = raw.id;
    this.name = raw.name;

    this.created = raw.created;

    this.host = raw.host;
    this.port = raw.port;

    this.secret = raw.secret;
  }

  public toJson() {
    return {
      id: this.id,
      name: this.name,
      host: this.host,
      port: this.port,
    };
  }
}
