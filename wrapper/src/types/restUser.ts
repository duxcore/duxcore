export interface UsernameAPIResponse {
  status: number,
  message: string,
  data?: {
    isTaken: boolean,
    username: string,
    timestamp: number
  },
  successful: boolean
}