import { FetchSessionRS } from "../util/types/reponseSchema";
import { NewSessionData, NewSessionDataResponse } from "../util/types/session";
import Wrapper from "../wrapper";

export class Session {
  private wrapper: Wrapper;
 
  constructor(base: Wrapper) {
    this.wrapper = base;
  }

  async fetch(sessionID: string): Promise<FetchSessionRS> {
    const fetched = await this.wrapper.socket.fetch('session:fetch', { session_id: sessionID });
    return fetched.p;
  }

  async new(data: NewSessionData): Promise<NewSessionDataResponse> {
    const newSessionData = await this.wrapper.socket.fetch('session:new', { client: data.client, ip: data.ip});
    return newSessionData.p;
  }

  requestAuthToken() {}
}