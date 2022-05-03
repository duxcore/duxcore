import { manifestation } from "@duxcore/manifestation";
import { authorizeRequest } from "../../middleware/authorizeRequest";
import { baseServicesRoutes } from "./base";
import { projectsRouter } from "./projects";

export const servicesRouter = manifestation.newRouter({
  route: "/services",
  middleware: [authorizeRequest],
  routers: [projectsRouter],
  routes: [...baseServicesRoutes],
});
