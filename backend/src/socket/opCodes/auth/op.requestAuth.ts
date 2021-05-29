import WSOperator from "../../../structures/WSOperator";

const op = new WSOperator({
  opCode: "auth:request", 
  enabled: true
});

op.setExecutor((payload, session) => {
  const authToken: string = payload.p.auth_token;

  session.authenticate(authToken).then(() => {
    payload.reply({success: true});
  }).catch(err => {
    console.log(err);
    payload.sendError(err);
  })
});

export default op;