import { manifestation } from "@duxcore/manifestation";
import { serverMonitorsRouter } from "./servers/servers";

export const monitorRouter = manifestation.newRouter({
  route: "/monitors",
  routes: [],
  routers: [serverMonitorsRouter]
});