export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  created: Date;
}

export interface NewUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
