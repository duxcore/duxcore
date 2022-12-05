export interface NewProject {
  name: string;
}

export interface Project {
  id: string;
  name: string;
  creator: string;
  created: Date;
  lastUpdated: Date;
}
