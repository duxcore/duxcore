export enum UserRole {
  SUPER_ADMINISTRATOR = "SUPER_ADMINISTRATOR",
  ADMINISTRATOR = "ADMINISTRATOR",
  SYS_ADMIN = "SYS_ADMIN",
  MODERATOR = "MODERATOR",
  USER = "USER",
}

export interface NewUserData {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface UserJWTObject {
  uuid: string;
  jid: string;
}