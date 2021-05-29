import { NewSessionData, SessionAuthToken, SessionDataObject } from "../util/types/session";
import Wrapper from "../wrapper";
export declare class Session {
    private wrapper;
    constructor(base: Wrapper);
    fetch(sessionID: string): Promise<SessionDataObject>;
    new(data: NewSessionData): Promise<SessionDataObject>;
    requestAuthToken(sessionId: any): Promise<SessionAuthToken>;
}
