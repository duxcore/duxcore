import { DaemonRegion } from "@prisma/client";

export default class DaemonRegionManager {
  private _raw: DaemonRegion;

  public readonly name: string;
  public readonly code: string;

  public readonly id: string;
  public readonly created: Date;

  constructor(raw: DaemonRegion) {
    this._raw = raw;

    this.name = raw.name;
    this.code = raw.code;
    this.id = raw.id;
    this.created = raw.created;
  }

  /**
   * Return data in JSON friendly format.
   * @returns - Data in JSON friendly format.
   */
  public toJson() {
    return {
      id: this.id,
      name: this.name,
      code: this.code,
    };
  }
}
