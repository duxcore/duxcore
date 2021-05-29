import WSOperator from "../../../structures/WSOperator";

const operator = new WSOperator({
  opCode: "session:fetch",
  enabled: true
});

operator.setExecutor(async (payload, session) => {
  const reply = `${payload.op}:reply`


  if (!payload.p.session_id) return payload.sendError("Missing or invalid Session ID");
  const sess = await session.client.sessions.get(payload.p.session_id);

  if (!sess) return payload.sendError("Session doesn't exist...");
  return payload.reply(sess.toJson());
});

export default operator;