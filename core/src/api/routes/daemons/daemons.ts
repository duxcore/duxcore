import { manifestation } from "@duxcore/manifestation";
import { authorizeAdministratorRequest } from "../../middleware/authorizeAdministrator";
import { apiDaemonBaseRoutes } from "./base";

export const daemonRoutes = manifestation.newRouter({
  route: "/daemons",
  middleware: [authorizeAdministratorRequest],
  routes: apiDaemonBaseRoutes,
});
