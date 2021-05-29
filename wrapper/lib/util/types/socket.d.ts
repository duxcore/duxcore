export declare const OpCode: {
    readonly session: {
        readonly fetch: "session:fetch";
        readonly new: "session:new";
        readonly getAuthToken: "session:get_auth_token";
    };
    readonly auth: {
        readonly request: "auth:request";
    };
};
export interface SocketMessage {
    op: string;
    p: any;
    ref: string;
}
