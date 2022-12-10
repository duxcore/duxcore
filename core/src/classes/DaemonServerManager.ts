import axios from "axios";
import { RawConfig } from "../types/Daemon";
import DaemonManager from "./DaemonManager";
import WebSocket from "ws";
import { Blob } from 'buffer'

export default class DaemonServerManager {
  private _daemon: DaemonManager;

  public isSecure: boolean;

  constructor(daemon: DaemonManager) {
    this._daemon = daemon;

    this.isSecure = daemon.secure;
  }

  public async createService(config: RawConfig) {
    return await axios
      .post(
        `http${this.isSecure ? "s" : ""}://${this._daemon.host}:${
          this._daemon.port
        }/v1/service`,
        config,
        {
          headers: {
            "X-Duxcore-CoreKey": this._daemon.secret,
          },
        }
      )
      .then(() => {
        return;
      });
  }

  public async attachToService(id: string, onMessage: (msg: Buffer) => void) {
    const ws = new WebSocket(
      `ws${this.isSecure ? "s" : ""}://${this._daemon.host}:${
        this._daemon.wsPort
      }/v1/service/${id}/ctl`
    );
    const sendJson = (json) => ws.send(JSON.stringify(json));
    const sendBlob = async (blob: Blob) => ws.send(await blob.arrayBuffer());
    const corekey = this._daemon.secret;

    ws.on("open", function open() {
      sendJson({
        corekey,
        type: "attach",
        data: {
          service_id: id,
          logs: true
        },
      });
    });

    ws.onmessage = (e) => {
      onMessage(e.data as Buffer);
    }

    return (input: any) => {
      sendBlob(new Blob([input.data + '\n']));
    }
  }

  public async deleteService(id: string) {
    return await axios
      .delete(
        `http${this.isSecure ? "s" : ""}://${this._daemon.host}:${
          this._daemon.port
        }/v1/service/${id}`,
        {
          headers: {
            "X-Duxcore-CoreKey": this._daemon.secret,
          },
        }
      )
      .then(() => {
        return;
      });
  }

  public async ctl(op: "start" | "stop" | "restart" | "kill", id: string) {
    return await axios
      .post(
        `http${this.isSecure ? "s" : ""}://${this._daemon.host}:${
          this._daemon.port
        }/v1/service/${id}/ctl`,
        {
          op,
        },
        {
          headers: {
            "X-Duxcore-CoreKey": this._daemon.secret,
          },
        }
      )
      .then(() => {
        console.log("Completed the starting of a daemon service.");
        return;
      });
  }
}
