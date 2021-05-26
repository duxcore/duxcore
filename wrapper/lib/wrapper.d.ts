import SocketAPI from "./classes/SocketAPI";
export default class Wrapper {
    socket: SocketAPI;
    constructor(wsUrl: string);
    close(): void;
    authenticateSession(): void;
}
