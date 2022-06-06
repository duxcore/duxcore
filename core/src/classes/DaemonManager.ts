import { Daemon } from "@prisma/client";
import { daemonRegions } from "../lib/daemonRegions";
import DaemonRegionManager from "./DaemonRegionManager";
import DaemonServerManager from "./DaemonServerManager";

export default class DaemonManager {
  private _raw: Daemon;
  public readonly id: string;
  public readonly code: string;
  public readonly name: string;

  public readonly created: Date;
  public readonly secret: string;

  public readonly host: string;
  public readonly port: string;
  public readonly wsPort: string;
  public readonly secure: boolean;

  public readonly region: Promise<DaemonRegionManager>;
  public readonly regionDiscriminator: string;

  public readonly cpuCeil: number;
  public readonly memCeil: number;
  public readonly diskCeil: number;

  constructor(raw: Daemon) {
    this._raw = raw;

    this.id = raw.id;
    this.name = raw.name;

    this.created = raw.created;

    this.host = raw.host;
    this.port = raw.port;
    this.wsPort = raw.wsPort;

    this.cpuCeil = raw.cpuCeil;
    this.memCeil = raw.memCeil;
    this.diskCeil = raw.diskCeil;

    this.regionDiscriminator = raw.regionDiscriminator;
    this.code = raw.code;

    this.secret = raw.secret;
    this.secure = raw.secure;
    this.region = daemonRegions.fetch(
      raw.regionId
    ) as Promise<DaemonRegionManager>;
  }

  public get server(): DaemonServerManager {
    return new DaemonServerManager(this);
  }

  public async toJson() {
    return {
      id: this.id,
      code: this.code,
      name: this.name,
      host: this.host,
      port: this.port,
      wsPort: this.wsPort,
      secure: this.secure,
      resourceCeil: {
        cpu: this.cpuCeil,
        memory: this.memCeil,
        disk: this.diskCeil,
      },
      region: {
        discriminator: this.regionDiscriminator,
        regionData: (await this.region).toJson(),
      },
    };
  }
}
