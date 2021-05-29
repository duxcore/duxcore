export interface SessionDataObject {
	user: string | null
}

export interface SessionObject {
	x_csrf: string,
	created: Date,
	expires: Date,
	attached_ip: string,
	attached_client: string,
	data: SessionDataObject
}

export interface NewSessionOpts {
	ip: string,
	client: string,
	data?: SessionDataObject
}

export enum SessionAuthMethod {
  SESSION,
  API_KEY
}