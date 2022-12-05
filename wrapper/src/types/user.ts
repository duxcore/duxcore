import type { User as PrismaUser } from '@prisma/client'

export type User = Pick<PrismaUser, 'id' | 'firstName' | 'lastName' | 'email' | 'created'>
export interface NewUser {
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  password: string;
}

export type UserEdit = Pick<PrismaUser, 'firstName' | 'lastName' | 'email'>;

export interface TokenPair {
  authToken: string;
  refreshToken: string;
}
