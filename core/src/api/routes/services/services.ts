import { manifestation } from "@duxcore/manifestation";
import { authorizeRequest } from "../../middleware/authorizeRequest";
import { baseServicesRoutes } from "./base";

export const servicesRouter = manifestation.newRouter({
  route: "/services",
  middleware: [authorizeRequest],
  routers: [],
  routes: [...baseServicesRoutes],
});
