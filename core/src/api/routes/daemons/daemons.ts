import { manifestation } from "@duxcore/manifestation";
import { authorizeAdministratorRequest } from "../../middleware/authorizeAdministrator";
import { apiDaemonBaseRoutes } from "./base";
import { daemonRegionRoutes } from "./regions";

export const daemonRoutes = manifestation.newRouter({
  route: "/daemons",
  middleware: [authorizeAdministratorRequest],
  routes: apiDaemonBaseRoutes,
  routers: [daemonRegionRoutes],
});
