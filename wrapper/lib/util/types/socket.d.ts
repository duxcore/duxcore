import { GetSessionAuthTokenPS } from "./payloadSchema";
import { GetSessionAuthTokenRS } from "./reponseSchema";
declare const OpCode: {
    readonly session: {
        readonly getAuthToken: "socket:get_auth_code";
    };
    readonly system: {
        readonly uganda: "system:uganda";
    };
};
export interface OpCodePayload {
    [OpCode.session.getAuthToken]: GetSessionAuthTokenPS;
    [OpCode.system.uganda]: any;
}
export interface OpCodeResponse {
    [OpCode.session.getAuthToken]: GetSessionAuthTokenRS;
    [OpCode.system.uganda]: any;
}
export interface OpCodeEvent {
}
export interface SocketMessage<Payload> {
    op: string;
    p: Payload;
    ref: string;
}
export {};
