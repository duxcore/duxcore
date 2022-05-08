# WebSocket API

The daemon listens for WebSocket connections on port 8001. That server is used
for API that requires transmitting continuos streams of data.

## Initialization

In order to initialize the WebSocket session, you first have to send a JSON
message of the following structure:

```ts
type Init = {
  corekey: string; // same as the X-Duxcore-CoreKey header
  command: CommandAttach | CommandStats;
};
```

## Attach

```ts
type CommandAttach = {
  type: "attach";
  data: {
    service_id: number;
    logs?: boolean; // default = false
  };
};
```

The attach command connects you with a tty of the specified container. The
messages are sent in binary blobs, because not all commands may output valid
UTF-8 data. Use the [`attach-example.js`](./attach-example.js) script as
reference client implementation.

## Stats

```ts
type CommandStats = {
  type: "stats";
  data: string; // service id
};
```

Basically redirects everything from the `docker state` command. See the
[`stats-example.js`](./stats-example.js) example.
