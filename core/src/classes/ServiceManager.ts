import { Project, Service, ServiceType, User } from "@prisma/client";
import ProjectManager from "./ProjectManager";
import ServiceTypeManager, { ModifiedServiceTypeInstance } from "./ServiceTypeManager";
import UserManager from "./UserManager";

export default class ServiceManager<ST> {
  private _raw;

  public readonly owner: UserManager;
  public readonly project: ProjectManager;

  public readonly id: string;
  public readonly created: Date;

  public readonly type: ServiceTypeManager;
  public readonly name: string;

  constructor(
    raw: Service & {
      project: Project;
      owner: User;
      type: ModifiedServiceTypeInstance;
    }
  ) {
    this._raw = raw;

    this.id = raw.id;
    this.created = raw.createdAt;
    this.name = raw.name;

    this.type = new ServiceTypeManager(raw.type);
    this.project = new ProjectManager(raw.project);
    this.owner = new UserManager(raw.owner);
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      created: this.created,
      type: this.type.toJson(),
      owner: this.owner.toJson(),
      project: this.project.toJson(),
    };
  }
}
