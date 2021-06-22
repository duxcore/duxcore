import trixi from "trixi";
import { restUser } from "./lib/rest/restUser";
import user from "./lib/ws/user";
import { wsUrl } from "./util/constraints";

const app = trixi();

export default {
  ws(url?: string) {
    const ws = app.createClient({ url: url ?? wsUrl });
  
    return {
      ws,
      url,
      user: user(ws)
    };
  },
  rest: {
    user: restUser
  }
}