import { OpCode } from "../util/types/socket";
import Wrapper from "../wrapper";

export class Auth {
  private _wrapper: Wrapper;

  constructor(wrapper: Wrapper) {
    this._wrapper = wrapper;
  }

  request(auth_token): Promise<any> {
    return new Promise(async (resolve, reject) => {
      this._wrapper.socket.fetch(OpCode.auth.request, { auth_token }).then(res => {
        resolve(res);
      }).catch(reject);
    }) 
  }
}