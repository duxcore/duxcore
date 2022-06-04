import { encode } from "https://deno.land/std/encoding/base64.ts";

const corekey = encode(await Deno.readFile("corekey.bin"));
const container = Deno.args[0];

const ws = new WebSocket("ws://localhost:8001");
const encoder = new TextEncoder();

const sendjson = json => ws.send(JSON.stringify(json));

ws.onopen = async () => {
  console.log("=> opened");

  sendjson({
    corekey: corekey,
    type: "stats",
    data: container,
  });
};

ws.onerror = e => console.error(e.message);

ws.onmessage = async x => {
  console.log(x.data);
};
