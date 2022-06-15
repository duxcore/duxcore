export enum ServiceType {
  NodeJsAppService
}

export interface Service {
  id: String
  type: ServiceType

  createdAt: String
  updatedAt: String

  ownerId: String
  projectId: String

  // ?
  // NodeJsAppService        NodeJsAppService?
  // ServerMonitoringService ServerMonitoringService?
}
