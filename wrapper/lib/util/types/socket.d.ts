import { FetchSessionPS, NewSessionPS } from "./payloadSchema";
import { FetchSessionRS } from "./reponseSchema";
declare const OpCode: {
    readonly session: {
        readonly fetch: "session:fetch";
        readonly new: "session:new";
    };
};
export interface OpCodePayload {
    [OpCode.session.fetch]: FetchSessionPS;
    [OpCode.session.new]: NewSessionPS;
}
export interface OpCodeResponse {
    [OpCode.session.fetch]: SocketMessage<FetchSessionRS>;
    [OpCode.session.new]: SocketMessage<FetchSessionRS>;
}
export interface OpCodeEvent {
}
export interface SocketMessage<Payload> {
    op: string;
    p: Payload;
    ref: string;
}
export {};
