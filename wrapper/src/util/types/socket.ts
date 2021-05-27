import { 
  FetchSessionPS,
  GetSessionAuthTokenPS, 
  NewSessionPS
} from "./payloadSchema";
import { 
  FetchSessionRS,
  GetSessionAuthTokenRS 
} from "./reponseSchema";

const OpCode = {
  session: {
    fetch: 'session:fetch',
    new: 'session:new'
  },
} as const;

export interface OpCodePayload {
  [OpCode.session.fetch]: FetchSessionPS
  [OpCode.session.new]: NewSessionPS
}

export interface OpCodeResponse {
  [OpCode.session.fetch]: SocketMessage<FetchSessionRS>
  [OpCode.session.new]: SocketMessage<FetchSessionRS>
}

export interface OpCodeEvent {}

export interface SocketMessage<Payload> {
  op: string;
  p: Payload;
  ref: string;
}