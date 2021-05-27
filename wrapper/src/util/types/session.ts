export interface NewSessionData {
  ip: string,
  client: string,
}

export interface NewSessionDataResponse {
  ip: string,
  client: string,
  x_csrf: string,
  session_id: string,
}