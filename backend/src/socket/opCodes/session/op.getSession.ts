import { WSError } from "../../../structures/WSError";
import WSOperator from "../../../structures/WSOperator";
import WSPayload from "../../../structures/WSPayload";

const operator = new WSOperator({
  opCode: "session:fetch",
  enabled: true
});

operator.setExecutor(async (payload, session) => {
  const reply = `${payload.op}:reply`

  if (!payload.p.session_id) return session.sendError(new WSError("Missing or invalid Session ID", `${payload.op}:reply`, payload.ref));
  const sess = await session.client.sessions.get(payload.p.session_id);

  if (!sess) {
    return session.sendError(new WSError("Session doesn't exist...", reply, payload.ref));
  }

  return session.connection.send(JSON.stringify(new WSPayload(reply, sess.toJson())));
});

export default operator;