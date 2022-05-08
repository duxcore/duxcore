import { Daemon } from "@prisma/client";
import DaemonServerManager from "./DaemonServerManager";

export default class DaemonManager {
  private _raw: Daemon;
  public readonly id: string;
  public readonly name: string;

  public readonly created: Date;
  public readonly secret: string;

  public readonly host: string;
  public readonly port: string;
  public readonly wsPort: string;
  public readonly secure: boolean;

  constructor(raw: Daemon) {
    this._raw = raw;

    this.id = raw.id;
    this.name = raw.name;

    this.created = raw.created;

    this.host = raw.host;
    this.port = raw.port;
    this.wsPort = raw.wsPort;

    this.secret = raw.secret;
    this.secure = raw.secure;
  }

  public get server(): DaemonServerManager {
    return new DaemonServerManager(this);
  }

  public toJson() {
    return {
      id: this.id,
      name: this.name,
      host: this.host,
      port: this.port,
      wsPort: this.wsPort,
      secure: this.secure,
    };
  }
}
