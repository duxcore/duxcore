export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  created: Date;
}

export interface NewUser {
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  password: string;
}

export interface TokenPair {
  authToken: string;
  refreshToken: string;
}
