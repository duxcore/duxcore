export type UsernameStatus =
  | "reserved"
  | "banned"
  | "available"
  | "taken";

export interface UsernameAPIResponse {
  status: number,
  message: string,
  data?: {
    status: UsernameStatus,
    username: string,
    timestamp: number
  },
  successful: boolean
}
