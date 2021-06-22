import { OperatorPayloadManager, SocketConnectionObject } from "trixi";

export default (
  payload: OperatorPayloadManager,
  instance: SocketConnectionObject
) => {
  console.log(payload);
};
