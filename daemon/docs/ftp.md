# FTP

The daemon has a built-in FTP server that lets any users manage their
containers' bind directory. It listens for connections on port 2121.

## Authorization

**Note: This is not currently implemented. The server lets you log in with any
credentials.**

The core's HTTP API is used to check the FTP credentials. This is one of the few
places where the daemon talks to the core, and not the other way around.
