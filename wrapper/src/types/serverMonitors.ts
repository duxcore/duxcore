export interface ServerMonitor {
  id: string;
  name: string;
  creatorId: string;
  projectId: string;
}

export interface NewServerMonitor {
  name: string;
  projectId: string;
}
