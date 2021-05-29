import * as uuid from 'uuid';
import { SocketPayload } from '../util/types/socket';
import WSPayload from './WSPayload';
export class WSError {
  private _op: string;
  private _reference: string;
  private _message: string;

  constructor(message: string, op?: string | null, reference?: string) {
    this._op = op ?? "server:error";
    this._reference = reference ?? uuid.v4();
    this._message = message;
  }

  get op(): string { return this._op; }
  get message(): string { return this._message; }
  get reference(): string { return this._message; }

  toString(): string { return JSON.stringify(this.compile()) }

  compile(): SocketPayload {
    const payloadObject = new WSPayload(
      this._op,
      { error: this._message },
      this._reference
    ).compile()

    return payloadObject;
  }
}