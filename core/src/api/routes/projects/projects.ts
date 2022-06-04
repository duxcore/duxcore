import { manifestation } from "@duxcore/manifestation";
import { authorizeRequest } from "../../middleware/authorizeRequest";
import { projectBaseRoutes } from "./base";

export const projectsRouter = manifestation.newRouter({
  route: "/projects",
  middleware: [authorizeRequest],
  routes: [...projectBaseRoutes],
  routers: [],
});
