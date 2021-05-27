export interface FetchSessionPS {
    session_id: string;
}
export interface GetSessionAuthTokenPS {
    session_id: string;
}
export interface NewSessionPS {
    client: string;
    ip: string;
}
