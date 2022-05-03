import { ServerMonitor } from "./serverMonitors";

export interface NewProject {
  name: string;
}

export interface Project {
  id: string;
  name: string;
  creator: string;
  created: string;
  lastUpdated: string;
  monitors: ServerMonitor[];
}
