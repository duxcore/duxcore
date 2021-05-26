export interface SocketPayload {
	op: string, // Payload Op Code
	p: any, // Payload Data
	ref: string // Reference ID
}

export interface SocketSessionOpts {
	id: string;
}