import axios from "axios";
import { RawConfig } from "../types/Daemon";
import DaemonManager from "./DaemonManager";
import WebSocket from "ws";

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

  public async attachToService(id: string) {
    const ws = new WebSocket(
      `ws${this.isSecure ? "s" : ""}://${this._daemon.host}:${
        this._daemon.wsPort
      }/v1/service/${id}/ctl`
    );
    const sendJson = (json) => ws.send(JSON.stringify(json));
    const corekey = this._daemon.secret;

    ws.on("open", function open() {
      sendJson({
        corekey,
        type: "attach",
        data: id,
      });
    });

    ws.onmessage = (e) => {
      process.stdout.write(e.data as Buffer);
    };
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
