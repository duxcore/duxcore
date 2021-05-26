import WSOperator from "../../../structures/WSOperator";
import WSPayload from "../../../structures/WSPayload";

const op = new WSOperator({
  opCode: "system:uganda", 
  enabled: true
});

op.setExecutor((payload, session) => {
  session.connection.send(JSON.stringify(new WSPayload("system:uganda:reply", ["knuckles"], payload.ref )));
});

export default op;