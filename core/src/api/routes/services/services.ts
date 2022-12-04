import { manifestation } from "@duxcore/manifestation";
import { apiServiceBaseRoutes } from "./base";

export const servicesRouter = manifestation.newRouter({
  route: "/services",
  routes: apiServiceBaseRoutes,
})
