import { manifestation } from "@duxcore/manifestation";
import { apiUserBaseRoutes } from "./base";
import { selfUserRouter } from "./selfUserRouter";

export const usersRouter = manifestation.newRouter({
  route: "/users",
  routes: apiUserBaseRoutes,
  routers: [selfUserRouter]
})