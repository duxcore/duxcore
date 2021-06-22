import { OperatorPayloadManager, SocketConnectionObject } from "trixi";
import { createUser } from "../../../lib/users";
import { NewUserData } from "../../../types/user";

export const registerUserWS =  (
  payload: OperatorPayloadManager,
  instance: SocketConnectionObject
) => {
  const data: NewUserData = payload.data;  

  console.log(data);

  createUser(data).then( user => {
    payload.reply({
      success: true
    })
  }).catch(err => {
    payload.reply({
      success: false,
      message: err.message
    })
  })
};
