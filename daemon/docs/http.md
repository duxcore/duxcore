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
    id: string; // id in the core's system
    image: string;
    bind_dir: string;
    bind_contents?: string; // url to a .tar.gz archive

    // unix
    cmd?: string[];
    shell?: string[];
    user?: string;
    working_dir?: string;
    env?: string[]; // example: VAR1=value1. no equals sign unsets the variable

    // stdio
    open_stdin?: boolean; // default = true
    tty?: boolean; // default = true

    // networking
    hostname?: string;
    port_map?: Record<`${string}/${string}`, HostMapEntry>;
    network_disabled?: boolean;

    // hardware
    max_cpu?: number; // max length of a cpu period in microsecs
    max_ram?: number; // in bytes
  };
};

type HostMapEntry = {
  HostIp?: string;
  HostPort: string;
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
