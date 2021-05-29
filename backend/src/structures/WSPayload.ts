import * as uuid from 'uuid';
import { SocketPayload } from '../util/types/socket';

export default class WSPayload {
  private _op: string;
  private _p: any;
  private _ref: string;

  constructor(op: string, p: any, ref?: string) {
    this._op = op;
    this._p = p;
    this._ref = ref ?? uuid.v4();
  }

  get op(): string { return this._op; }
  get p(): any { return this._p; }
  get ref(): string { return this._ref; }

  toString(): string { return JSON.stringify(this.compile()); }

  compile(): SocketPayload {
    const object = {
      op: this._op,
      p: this._p,
      ref: this._ref
    }

    return object
  }
}