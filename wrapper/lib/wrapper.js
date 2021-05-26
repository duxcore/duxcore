"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const websocket_1 = require("websocket");
const SocketAPI_1 = __importDefault(require("./classes/SocketAPI"));
class Wrapper {
    constructor(wsUrl) {
        const socket = new websocket_1.w3cwebsocket(wsUrl);
        this.socket = new SocketAPI_1.default(socket, this);
    }
    close() { this.socket.close(); }
    authenticateSession() {
    }
}
exports.default = Wrapper;
