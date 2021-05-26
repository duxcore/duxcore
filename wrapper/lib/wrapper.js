"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const websocket_1 = require("websocket");
class Wrapper {
    constructor(wsUrl) {
        this.socket = new websocket_1.w3cwebsocket(wsUrl);
        this.socket.onerror = (err) => {
            throw err;
        };
    }
}
exports.default = Wrapper;
