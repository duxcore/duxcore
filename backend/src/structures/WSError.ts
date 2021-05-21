import { WebsocketMessageObject } from './WSMessageObject';
import { WebSocketServer } from '../classes/WebSocketServer';
import uuid from 'uuid';
export class WSError {
  constructor(message: string, reference?: string) {

    return new WebsocketMessageObject({
      scope: "server",
      operationCode: "error",
      version: WebSocketServer.currentApiVersion,
      isReply: false,
      payload: {
        error: message
      },
      reference: reference ?? uuid.v4()
    })
  }
}