import trixi from "trixi";
import { Wrapper } from "./types/Wrapper";

export default function wrapper(url: string): Wrapper {
  const app = trixi();
  const ws = app.createClient({ url });

  return {
    ws,
    url,
  };
}
