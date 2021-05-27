"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const websocket_1 = require("websocket");
const Session_1 = require("./classes/Session");
const SocketAPI_1 = __importDefault(require("./classes/SocketAPI"));
class Wrapper {
    constructor(wsUrl) {
        this.session = new Session_1.Session(this);
        const socket = new websocket_1.w3cwebsocket(wsUrl);
        this.socket = new SocketAPI_1.default(socket, this);
    }
    close() { this.socket.close(); }
    authenticateSession() {
    }
}
exports.default = Wrapper;
