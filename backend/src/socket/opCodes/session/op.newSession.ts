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

  if (!client) socket.sendError(new WSError('"client" is required to create a new session.', operator.replyCall, ref));
  if (!ip) socket.sendError(new WSError('"ip" is required to create a new session', operator.replyCall, ref));

  const newSession = await socket.client.sessions.new({ client, ip, data });
  socket.connection.send(JSON.stringify(new WSPayload(operator.replyCall, newSession.toJson())))  
});

export default operator;