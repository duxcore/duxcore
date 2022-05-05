# HTTP API

The HTTP API server listens for requests on port 8000.

## `X-Duxcore-CoreKey`

Most of the daemon's interaction with the core is done through the HTTP API,
where the core's authenticity is checked using the `X-Duxcore-CoreKey` header,
which both the daemon and the core must know. The header is in base64, and the
local binary version of it is loaded from the file `corekey.bin` on startup.

## `POST /service`

Creates a service (without starting it).

### Request

```ts
type Body = RawConfig;

type RawConfig = {
  type: "raw";
  params: {
    image: string;
    bind_dir: string;

    // unix
    cmd?: string[];
    shell?: string[];
    user?: string;
    working_dir?: string;

    // stdio
    open_stdin?: boolean; // default = true
    tty?: boolean; // default = true

    // networking
    hostname?: string;
    port_map?: Record<`${string}/${string}`, HostMapEntry>;
    network_disabled?: boolean;
  };
};

type HostMapEntry = {
  HostIp?: string;
  HostPort: string;
};
```

### Response

```ts
type Body = {
  container_id: string;
};
```

## `POST /service/<id>/ctl`

Performs various operations on a service, much like the `systemctl` command in
systemd.

### Request

```ts
type Body = {
  op: "start" | "stop" | "restart" | "kill";
};
```

## `POST /docker/image`

Imports a Docker image from a raw .tar archive containing the root filesystem.

### Request

A binary .tar archive
