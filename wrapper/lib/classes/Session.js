"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
class Session {
    constructor(base) {
        this.wrapper = base;
    }
    async fetch(sessionID) {
        const fetched = await this.wrapper.socket.fetch('session:fetch', { session_id: sessionID });
        return fetched.p;
    }
    async new(data) {
        const newSessionData = await this.wrapper.socket.fetch('session:new', { client: data.client, ip: data.ip });
        return newSessionData.p;
    }
    requestAuthToken() { }
}
exports.Session = Session;
