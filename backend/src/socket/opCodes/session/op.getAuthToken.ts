import WSOperator from "../../../structures/WSOperator";

const operator = new WSOperator({
  opCode: "session:get_auth_token",
  enabled: true
});

operator.setExecutor(async (payload, socket) => {
  if (!payload.p.session_id) return payload.sendError("Missing or invalid Session ID");
  const sess = await socket.client.sessions.get(payload.p.session_id);

  if (!sess) return payload.sendError("Session doesn't exist");

  const authToken = sess.generateJWT();
  payload.reply({
    session_id: sess.id,
    auth_token: authToken
  })
});

export default operator;