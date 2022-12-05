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

export type UserEdit = Pick<User, 'firstName' | 'lastName' | 'email'>;

export interface TokenPair {
  authToken: string;
  refreshToken: string;
}
