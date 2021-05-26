import * as uuid from 'uuid';

export default class WSPayload {
  constructor(op: string, p: any, ref?: string) {
    return {
      op,
      p,
      ref: ref ?? uuid
    }
  }
}