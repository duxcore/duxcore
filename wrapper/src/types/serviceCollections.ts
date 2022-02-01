import { ServerMonitor } from "./serverMonitors"

export interface NewCollection {
  name: string
}

export interface Collection {
  id: string
  name: string
  creator: string
  created: string
  lastUpdated: string
  monitors: ServerMonitor[]
}
