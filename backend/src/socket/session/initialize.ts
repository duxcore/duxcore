import { SocketSession } from "../../classes/SocketSession";

export default (sockSession: SocketSession) => {
	return async (sessionId: string) => {
		const session = await sockSession.client.sessions.get(sessionId);
		
	}
}