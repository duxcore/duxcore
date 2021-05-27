import { FetchSessionRS } from "../util/types/reponseSchema";
import { NewSessionData, NewSessionDataResponse } from "../util/types/session";
import Wrapper from "../wrapper";
export declare class Session {
    private wrapper;
    constructor(base: Wrapper);
    fetch(sessionID: string): Promise<FetchSessionRS>;
    new(data: NewSessionData): Promise<NewSessionDataResponse>;
    requestAuthToken(): void;
}
