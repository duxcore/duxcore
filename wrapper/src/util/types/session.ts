export interface NewSessionData {
  ip: string,
  client: string,
}

export interface SessionDataObject {
  ip: string,
  client: string,
  x_csrf: string,
  session_id: string,
}

export interface SessionAuthToken {
  session_id: string,
  auth_token: string
}