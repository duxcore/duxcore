import { TrixiClient } from "trixi";

export interface Wrapper {
  ws: TrixiClient;
  url: string;
}
