"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = __importStar(require("uuid"));
const collection_1 = __importDefault(require("@discordjs/collection"));
const constraints_1 = require("../util/constraints");
class SocketAPI {
    constructor(socket, wrapper) {
        this._onFetchDoneQueue = new collection_1.default();
        this.base = socket;
        this.wrapper = wrapper;
        this.url = this.base.url;
        this.startHeartbeat();
        this._handleQueueRoutine();
    }
    _handleQueueRoutine() {
        this.base.onmessage = e => {
            if (e.data.toString() == 'pong')
                return;
            const msg = JSON.parse(e.data.toString());
            this._onFetchDoneQueue.forEach((value, key) => {
                if (key = msg.ref) {
                    value(msg);
                    return this._onFetchDoneQueue.delete(key);
                }
            });
        };
    }
    wscon() {
        return new Promise(res => {
            const interval = setInterval(() => {
                if (this.base._connection == undefined)
                    return;
                else
                    res();
                return clearInterval(interval);
            }, 1);
        });
    }
    extractError(msg) {
        if (msg.p['error'] !== undefined)
            return msg.p['error'];
        return null;
    }
    async startHeartbeat() {
        await this.wscon();
        this._heartbeat = setInterval(() => { this.base.send('ping'); }, constraints_1.heartbeatInterval);
        this.base.onclose = e => clearInterval(this._heartbeat);
    }
    close() {
        clearInterval(this._heartbeat);
        this.base.close();
    }
    fetch(op, payload) {
        return new Promise(async (resolve, reject) => {
            await this.wscon();
            let ref = uuid.v4();
            let obj = { op, p: payload, ref };
            const requestTimeout = setTimeout(() => reject('Timed out whilst attempting a socket API request...'), constraints_1.socketRequestTimeout);
            this._onFetchDoneQueue.set(ref, (msg) => {
                clearTimeout(requestTimeout);
                const err = this.extractError(msg);
                if (err)
                    return reject({ message: err, payload: msg });
                return resolve(msg);
            });
            this.base.send(JSON.stringify(obj));
        });
    }
}
exports.default = SocketAPI;
