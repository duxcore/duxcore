import uuid from 'uuid';

interface WSROptions {
  scope: string,
  operationCode: string,
  version: string
  isReply?: boolean
  payload?: any,
  reference?: string
}

interface CompiledMessageObject {
  op: string,
  p: any,
  v: string,
  ref: string,
}

export class WebsocketMessageObject {

  private scope: string;
  private operationCode: string;
  private payload: any;
  private version: string;
  private reference: string;
  
  private isReply?: boolean;
  
  constructor(options: WSROptions) {
    this.scope = options.scope;
    this.operationCode = options.operationCode ?? null;
    this.isReply = options.isReply ?? false;
    this.payload = options.payload ?? null;
    this.version = options.version ?? null;
    this.reference = options.reference ?? uuid.v4();
  }

  get opCode(): string {
    const reply = (this.isReply ? ":reply" : "");
    return `${this.scope}:${this.operationCode}${reply}`;
  }

  compile(): CompiledMessageObject {
    let newResObj: CompiledMessageObject = {
      op: this.opCode,
      p: this.payload,
      ref: this.reference,
      v: this.version
    }

    return newResObj;
  }
}