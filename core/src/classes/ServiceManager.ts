import { Project, Service, User } from "@prisma/client";
import ProjectManager from "./ProjectManager";
import UserManager from "./UserManager";

export default class ServiceManager<ST> {
  private _raw;

  public readonly owner: UserManager;
  public readonly project: ProjectManager;

  public readonly id: string;
  public readonly created: Date;
  public readonly type: string;
  public readonly name: string;

  constructor(
    raw: Service & {
      project: Project;
      owner: User;
    },
    serviceType: string,
    processedData: {
      owner: UserManager;
      project: ProjectManager;
    }
  ) {
    this._raw = raw;

    this.id = raw.id;
    this.created = raw.createdAt;
    this.name = raw.name;

    this.type = serviceType;
    this.project = processedData.project;
    this.owner = processedData.owner;
  }

  async toJson() {
    return {
      id: this.id,
      type: this.type,
      created: this.created,
      owner: this.owner.toJson(),
      project: await this.project.toJson(),
    };
  }
}
