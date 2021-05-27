export interface FetchSessionRS {
  x_csrf: string,
  client: string,
  session_id: string,
  ip: string
}

export interface GetSessionAuthTokenRS {
  auth_token: string;
}