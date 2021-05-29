import { WSError } from "../../../structures/WSError";
import WSOperator from "../../../structures/WSOperator";
import WSPayload from "../../../structures/WSPayload";

const operator = new WSOperator({
  opCode: "session:new",
  enabled: true
});

operator.setExecutor(async (payload, socket) => {
  const ref = payload.ref;
  
  const client = payload.p.client;
  const ip = payload.p.ip;
  const data = payload.p.data ?? {};

  if (!client) payload.sendError('"client" is required to create a new session.');
  if (!ip) payload.sendError('"ip" is required to create a new session');

  const newSession = await socket.client.sessions.new({ client, ip, data });
  payload.reply(newSession.toJson());  
});

export default operator;