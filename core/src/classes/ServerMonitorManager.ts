import { ServerMonitoringService } from "@prisma/client";
import { projects } from "../lib/projects";
import { users } from "../lib/users";
import ProjectManager from "./projectManager";
import UserManager from "./UserManager";

export default class ServerMonitorManager {
  private _raw: ServerMonitoringService;

  constructor(raw: ServerMonitoringService) {
    this._raw = raw;
  }

  get id(): string {
    return this._raw.id;
  }
  get name(): string {
    return this._raw.name;
  }
  get secret(): string {
    return this._raw.secret;
  }

  get creatorId(): string {
    return this._raw.creatorId;
  }
  get creator(): Promise<UserManager> {
    return users.fetch(this._raw.creatorId) as Promise<UserManager>;
  }

  get projectId(): string {
    return this._raw.projectId;
  }
  get project(): Promise<ProjectManager> {
    return projects.fetch(this._raw.projectId) as Promise<ProjectManager>;
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      creatorId: this.creatorId,
      projectId: this.projectId,
    };
  }
}
