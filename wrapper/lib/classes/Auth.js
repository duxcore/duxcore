"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const socket_1 = require("../util/types/socket");
class Auth {
    constructor(wrapper) {
        this._wrapper = wrapper;
    }
    request(auth_token) {
        return new Promise(async (resolve, reject) => {
            this._wrapper.socket.fetch(socket_1.OpCode.auth.request, { auth_token }).then(res => {
                resolve(res);
            }).catch(reject);
        });
    }
}
exports.Auth = Auth;
