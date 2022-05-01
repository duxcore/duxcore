# Duxcore Daemon
A program that turns anything into a datacenter.

## Requirements
- Docker

## Testing

### `X-Duxcore-CoreKey`
You can generate a corekey locally with this command:
```sh
dd if=/dev/random count=1 bs=1k of=corekey.bin
```
And then you can use this to see it in a base64 representation (that's the header's format):
```sh
base64 -w 0 corekey.bin
```

### Attachment
See the `attach-example.js` file. You can run it in Deno (specifying the container ID as the first argument). It's supposed to open an attachment stream and type `ls /` to it. You may expect to have the shell interpret that and print back the files in the container's root directory.
