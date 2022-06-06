export type RawConfig = {
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
    port_map?: Record<`${string}/${string}`, { HostPort: string }[]>;
    network_disabled?: boolean;

    // hardware
    max_cpu?: number; // max length of a cpu period in microsecs
    max_ram?: number; // in bytes
  };
};
