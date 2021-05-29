import { Auth } from "./classes/Auth";
import { Session } from "./classes/Session";
import SocketAPI from "./classes/SocketAPI";
export default class Wrapper {
    socket: SocketAPI;
    session: Session;
    auth: Auth;
    constructor(wsUrl: string);
    close(): void;
    authenticateSession(): void;
}
