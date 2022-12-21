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

### Response

_None_

## `POST /service/<id>/ctl`

Performs various operations on a service, much like the `systemctl` command in
systemd.

### Request

```ts
type Body = {
  op: "start" | "stop" | "restart" | "kill";
};
```

### Response

_None_

## `GET /service/<id>/stats`

Outputs the resource usage statistics of the service.

### Response **EXAMPLE**

```json
{
  "read": "2022-05-08T19:50:43.024725738Z",
  "preread": "2022-05-08T19:50:42.020410692Z",
  "num_procs": 0,
  "pids_stats": {
    "current": 20,
    "limit": 38407
  },
  "network": null,
  "networks": {
    "eth0": {
      "rx_dropped": 0,
      "rx_bytes": 160605,
      "rx_errors": 0,
      "tx_packets": 47,
      "tx_dropped": 0,
      "rx_packets": 139,
      "tx_errors": 0,
      "tx_bytes": 3996
    }
  },
  "memory_stats": {
    "stats": {
      "anon": 26759168,
      "file": 56995840,
      "kernel_stack": 327680,
      "slab": 1010848,
      "sock": 0,
      "shmem": 0,
      "file_mapped": 26505216,
      "file_dirty": 32768,
      "file_writeback": 0,
      "anon_thp": 10485760,
      "inactive_anon": 8192,
      "active_anon": 26656768,
      "inactive_file": 18722816,
      "active_file": 38273024,
      "unevictable": 0,
      "slab_reclaimable": 554704,
      "slab_unreclaimable": 456144,
      "pgfault": 50187,
      "pgmajfault": 319,
      "workingset_refault": 0,
      "workingset_activate": 0,
      "workingset_nodereclaim": 0,
      "pgrefill": 0,
      "pgscan": 0,
      "pgsteal": 0,
      "pgactivate": 0,
      "pgdeactivate": 0,
      "pglazyfree": 0,
      "pglazyfreed": 0,
      "thp_fault_alloc": 44,
      "thp_collapse_alloc": 0
    },
    "max_usage": null,
    "usage": 85823488,
    "failcnt": null,
    "limit": 33645404160,
    "commit": null,
    "commit_peak": null,
    "commitbytes": null,
    "commitpeakbytes": null,
    "privateworkingset": null
  },
  "blkio_stats": {
    "io_service_bytes_recursive": [
      {
        "major": 8,
        "minor": 32,
        "op": "read",
        "value": 56963072
      },
      {
        "major": 8,
        "minor": 32,
        "op": "write",
        "value": 98304
      }
    ],
    "io_serviced_recursive": null,
    "io_queue_recursive": null,
    "io_service_time_recursive": null,
    "io_wait_time_recursive": null,
    "io_merged_recursive": null,
    "io_time_recursive": null,
    "sectors_recursive": null
  },
  "cpu_stats": {
    "cpu_usage": {
      "percpu_usage": null,
      "usage_in_usermode": 3946966000,
      "total_usage": 4296864000,
      "usage_in_kernelmode": 349897000
    },
    "system_cpu_usage": 490804490000000,
    "online_cpus": 12,
    "throttling_data": {
      "periods": 0,
      "throttled_periods": 0,
      "throttled_time": 0
    }
  },
  "precpu_stats": {
    "cpu_usage": {
      "percpu_usage": null,
      "usage_in_usermode": 2156395000,
      "total_usage": 2336810000,
      "usage_in_kernelmode": 180414000
    },
    "system_cpu_usage": 490792560000000,
    "online_cpus": 12,
    "throttling_data": {
      "periods": 0,
      "throttled_periods": 0,
      "throttled_time": 0
    }
  },
  "storage_stats": {
    "read_count_normalized": null,
    "read_size_bytes": null,
    "write_count_normalized": null,
    "write_size_bytes": null
  },
  "name": "/123213123",
  "id": "900163237c2ec7e8a16aff615ca111d23cb29a69a1efea749d3f4673ae1c0161"
}
```

## `DELETE /service/<id>`

Deletes a service and its bind directory.

### Response

_None_

## `GET /service/<id>`

Fetches container information.

### Response

Same as [ContainerInspect](https://docs.docker.com/engine/api/v1.41/#operation/ContainerInspect)'s response.

## `PATCH /service/<id>/env`

Sets the service's environment variables. The changes will be applied after the next restart.

### Request

```ts
type Body = {
  [key: string]: string;
};
```

### Response

_None_

## `POST /docker/image`

Imports a Docker image from a raw .tar archive containing the root filesystem.

### Request

_None_

### Response

_None_

### Request

A binary .tar archive

### Response

```ts
type Body = {
  image_id: string;
};
```
