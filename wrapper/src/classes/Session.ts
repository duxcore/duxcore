import { NewSessionData, SessionAuthToken, SessionDataObject } from "../util/types/session";
import { OpCode } from "../util/types/socket";
import Wrapper from "../wrapper";

export class Session {
  private wrapper: Wrapper;
 
  constructor(base: Wrapper) {
    this.wrapper = base;
  }

  async fetch(sessionID: string): Promise<SessionDataObject> {
    const fetched = await this.wrapper.socket.fetch(OpCode.session.fetch, { session_id: sessionID });
    return fetched.p;
  }

  async new(data: NewSessionData): Promise<SessionDataObject> {
    const newSessionData = await this.wrapper.socket.fetch(OpCode.session.new, { client: data.client, ip: data.ip});
    return newSessionData.p;
  }

  async requestAuthToken(sessionId): Promise<SessionAuthToken> {
    const authTokenRequestData = await this.wrapper.socket.fetch(OpCode.session.getAuthToken, { session_id: sessionId});
    return authTokenRequestData.p;
  }
}