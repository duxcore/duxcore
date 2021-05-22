"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const websocket_1 = require("websocket");
class Wrapper {
    constructor(wsUrl) {
        this.socket = new websocket_1.client();
        this.socket.on("connectFailed", (err) => { throw err; });
        this.socket.on("connect", conn => this.connection = conn);
        this.socket.connect(wsUrl);
    }
}
exports.default = Wrapper;
