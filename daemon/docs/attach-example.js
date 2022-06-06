import { readLines } from "https://deno.land/std/io/buffer.ts";
import { encode } from "https://deno.land/std/encoding/base64.ts";

const corekey = encode(await Deno.readFile("corekey.bin"));
const container = Deno.args[0];

const ws = new WebSocket("ws://localhost:8001");
const encoder = new TextEncoder();

const sendjson = json => ws.send(JSON.stringify(json));
const sendblob = data => ws.send(new Blob([data]));
const printraw = text => Deno.stdout.write(encoder.encode(text));

ws.onopen = async () => {
  console.log("=> opened");

  sendjson({
    corekey: corekey,
    type: "attach",
    data: {
      service_id: container,
      logs: true,
    },
  });
};

ws.onerror = e => console.error(e.message);

let lastline;

ws.onmessage = async x => {
  if (x.data instanceof Blob) {
    const buf = await x.data.arrayBuffer();

    // this prevents stdin doubling
    const view = new Uint8Array(buf);
    const lastNl = view.lastIndexOf(0x0A);
    lastline = lastNl == - 1 ? buf : buf.slice(lastNl + 1);

    await Deno.stdout.write(buf);
  }
};


for await (const line of readLines(Deno.stdin)) {
  // this prevents stdin doubling
  lastline && await Deno.stdout.write(lastline);
  await printraw(`\x1b[1A\x1b[0K`);

  sendblob(`${line}\n`);
}
