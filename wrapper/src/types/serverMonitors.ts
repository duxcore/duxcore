export interface ServerMonitor {
  id: string;
  name: string;
  creatorId: string;
  collectionId: string;
}

export interface NewServerMonitor {
  name: string;
  creatorId: string;
  collectionId: string;
}
