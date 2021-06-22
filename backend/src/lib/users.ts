import Password from "../classes/Password";
import User from "../classes/User";
import { NewUserData, UserJWTObject } from "../types/user";
import { prisma } from "../util/prisma/instance";
import jwt from "jsonwebtoken";
import uid from 'uuid';

export function createUser(data: NewUserData): Promise<User> {
  return new Promise(async (resolve, reject) => {
    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        username: data.username,
        password: Password.hash(data.password),
      },
    });
  });
}
export async function generateUserJwt(uuid: string) {
  const jid = uid.v4();
  await prisma.token.create({
    data: {
      jid,
      userId: uuid
    }
  });

  const object: UserJWTObject = {
    uuid: uuid,
    jid
  }
}