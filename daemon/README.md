# Duxcore Daemon

A program that turns anything into a datacenter.

## Requirements

- [Docker](https://docker.com)
- [Rust nightly](https://rustup.rs/)

## Testing

### `X-Duxcore-CoreKey`

You can generate a corekey locally with this command:

```sh
dd if=/dev/random count=1 bs=1k of=corekey.bin
```

And then you can use this to see it in a base64 representation (that's the
header's format):

```sh
base64 -w 0 corekey.bin
```
