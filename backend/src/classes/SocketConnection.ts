import { SocketConnectionObject, TrixiServer } from "trixi";

export default class SocketConnection {
  private _socket: TrixiServer;

  private _connection: SocketConnectionObject;

  public opened: Date;

  constructor(socket: TrixiServer, connection: SocketConnectionObject) {
    this._socket = socket;
    this._connection = connection;

    this.opened = new Date();
  }
}
