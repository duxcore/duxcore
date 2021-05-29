"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const socket_1 = require("../util/types/socket");
class Session {
    constructor(base) {
        this.wrapper = base;
    }
    async fetch(sessionID) {
        const fetched = await this.wrapper.socket.fetch(socket_1.OpCode.session.fetch, { session_id: sessionID });
        return fetched.p;
    }
    async new(data) {
        const newSessionData = await this.wrapper.socket.fetch(socket_1.OpCode.session.new, { client: data.client, ip: data.ip });
        return newSessionData.p;
    }
    async requestAuthToken(sessionId) {
        const authTokenRequestData = await this.wrapper.socket.fetch(socket_1.OpCode.session.getAuthToken, { session_id: sessionId });
        return authTokenRequestData.p;
    }
}
exports.Session = Session;
