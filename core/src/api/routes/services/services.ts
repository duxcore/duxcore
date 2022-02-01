import { manifestation } from "@duxcore/manifestation";
import { authorizeRequest } from "../../middleware/authorizeRequest";
import { baseServicesRoutes } from "./base";
import { collectionsRouter } from "./collections";

export const servicesRouter = manifestation.newRouter({
  route: "/services",
  middleware: [authorizeRequest],
  routers: [collectionsRouter],
  routes: [...baseServicesRoutes],
})