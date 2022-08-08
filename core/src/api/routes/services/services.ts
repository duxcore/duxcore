import { manifestation } from "@duxcore/manifestation";
import { authorizeRequest } from "../../middleware/authorizeRequest";
import { baseServicesRoutes } from "./base";
import { serviceTypesRouter } from "./types";

export const servicesRouter = manifestation.newRouter({
  route: "/services",
  middleware: [authorizeRequest],
  routers: [serviceTypesRouter],
  routes: [...baseServicesRoutes],
});
