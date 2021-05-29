export const OpCode = {
  session: {
    fetch: 'session:fetch',
    new: 'session:new',
    getAuthToken: 'session:get_auth_token'
  },
  auth: {
    request: "auth:request"
  }
} as const;

export interface SocketMessage {
  op: string;
  p: any;
  ref: string;
}