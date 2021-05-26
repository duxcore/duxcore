import * as uuid from 'uuid';
export class WSError {
  constructor(message: string, op?: string | null, reference?: string) {

    return {
      op: (!op ? "server:error" : op),
      p: {
        error: message
      },
      ref: reference ?? uuid.v4()
    }
  }
}