export type UsernameStatus = "reserved" | "banned" | "available" | "taken";

export interface BaseAPIResponse {
  status: number;
  message: string;
  successful: boolean;
  data?: Record<string, unknown>;
}
export interface UsernameAPIResponse extends BaseAPIResponse {
  data?: {
    status: UsernameStatus;
    username: string;
    timestamp: number;
  };
}

export interface ReservedUsernameAPIResponse extends BaseAPIResponse {
  data?: {
    index: number;
    username: string;
    key: string;
    timestamp: number;
  };
}
