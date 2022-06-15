import { Service } from "./service";

export interface NewProject {
  name: string;
}

export interface Project {
  id: string;
  name: string;
  creator: string;
  created: string;
  lastUpdated: string;
  services: Service[];
}
