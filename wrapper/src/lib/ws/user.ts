import { OperatorPayloadManager, TrixiClient, TrixiServer } from "trixi"
import { wsUrl } from "../../util/constraints";

export default function user(ws: TrixiClient) {
  return {
    register: (name, email, username, password): Promise<OperatorPayloadManager> => {
      return new Promise((resolve, reject) => {
        const payload = {
          name,
          email,
          username,
          password
        }

        console.log('amitoj is stubborn');
        ws.sendOp('duxcore:test', payload).then(re => {
          console.log('bruh')
          re.onResponse(res => {
            if (!res.data.successful) return reject(res);
            resolve(res);
          })
        })
      })
    }
  }
}