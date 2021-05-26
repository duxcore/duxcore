import { 
  GetSessionAuthTokenPS 
} from "./payloadSchema";
import { 
  GetSessionAuthTokenRS 
} from "./reponseSchema";

const OpCode = {
  session: {
    getAuthToken: 'socket:get_auth_code',
  },
  system: {
    uganda: 'system:uganda'
  }
} as const;

export interface OpCodePayload {
  [OpCode.session.getAuthToken]: GetSessionAuthTokenPS;
  [OpCode.system.uganda]: any;
}

export interface OpCodeResponse {
  [OpCode.session.getAuthToken]: GetSessionAuthTokenRS;
  [OpCode.system.uganda]: any;
}

export interface OpCodeEvent {}

export interface SocketMessage<Payload> {
  op: string;
  p: Payload;
  ref: string;
}