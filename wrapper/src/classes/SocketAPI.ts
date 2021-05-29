import { w3cwebsocket as WebSocketClient } from "websocket"
import { SocketMessage } from "../util/types/socket";
import Wrapper from "../wrapper";
import * as uuid from 'uuid';
import Collection from '@discordjs/collection';
import { heartbeatInterval, socketRequestTimeout } from "../util/constraints";

export default class SocketAPI {
  public base: WebSocketClient;
  public wrapper: Wrapper;

  public url: string;

  private _onFetchDoneQueue: Collection<string, (msg: SocketMessage) => void> = new Collection();
  private _heartbeat: any;

  constructor(socket: WebSocketClient, wrapper: Wrapper) {
    this.base = socket;
    this.wrapper = wrapper;

    this.url = this.base.url;

    this.startHeartbeat();
    this._handleQueueRoutine();
  }

  private _handleQueueRoutine() {
    this.base.onmessage = e => {
      if (e.data.toString() == 'pong') return;
      const msg: SocketMessage = JSON.parse(e.data.toString());
      this._onFetchDoneQueue.forEach((value, key) => {
        if (key = msg.ref) {
          value(msg);
          return this._onFetchDoneQueue.delete(key);
        }
      });
    }
  }

  private wscon(): Promise<void> {
    return new Promise(res => {
      const interval = setInterval(() => {
        if (this.base._connection == undefined) return;
        else res();

        return clearInterval(interval)
      }, 1)
    });
  }

  private extractError(msg: SocketMessage): string | null {
    if (msg.p['error'] !== undefined) return msg.p['error'];
    return null;
  }

  private async startHeartbeat() {
    await this.wscon();
    this._heartbeat = setInterval(() => { this.base.send('ping') }, heartbeatInterval)

    this.base.onclose = e => clearInterval(this._heartbeat);
  }

  close(): void {
    clearInterval(this._heartbeat);
    this.base.close();
  }

  fetch(op: string, payload?: any): Promise<SocketMessage> {
    return new Promise(async (resolve, reject) => {
      await this.wscon();

      let ref = uuid.v4();
      let obj = { op, p: payload, ref}

      const requestTimeout = setTimeout(() => reject('Timed out whilst attempting a socket API request...'), socketRequestTimeout);
      this._onFetchDoneQueue.set(ref, (msg) => {
        clearTimeout(requestTimeout);
        const err = this.extractError(msg);
        if (err) return reject({message: err, payload: msg});
        
        return resolve(msg);
      });
      this.base.send(JSON.stringify(obj));
    })
  }
}