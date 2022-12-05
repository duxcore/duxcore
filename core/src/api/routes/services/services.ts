import { manifestation } from "@duxcore/manifestation";
import { authorizeRequest } from "../../middleware/authorizeRequest";
import { apiServiceBaseRoutes } from "./base";

export const servicesRouter = manifestation.newRouter({
  middleware: [authorizeRequest],
  route: "/services",
  routes: apiServiceBaseRoutes,
})
