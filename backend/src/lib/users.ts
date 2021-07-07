import Password from "../classes/Password";
import User from "../classes/User";
import { NewUserData, UserJWTObject } from "../types/user";
import { prisma } from "../util/prisma/instance";
import jwt from "jsonwebtoken";
import uid from 'uuid';

export async function createUser(data: NewUserData): Promise<User | void> {    

  if (data.unKey) await prisma.reservedUsername.delete({where: { key: data.unKey }});

  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      username: data.username,
      password: Password.hash(data.password),
    },
  });

  return;
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