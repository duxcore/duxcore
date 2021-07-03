import { prisma } from "../util/prisma/instance";



export enum UsernameStatus {
  AVAILABLE,
  TAKEN,
  RESERVED,
  BANNED
}

export function testUsername(username: string, key?: string): Promise<UsernameStatus> {
  return new Promise(async (resolve, reject) => {

    const isReserved = await prisma.reservedUsername.findFirst({
      where: {
        username
      }
    }).then(un /** username */ => {
      if (!un) return true;
      else return false;
    }).catch(reject);

    const isBanned = await await prisma.reservedUsername.findFirst({
      where: {
        username
      }
    }).then(un /** username */ => {
      if (!un) return true;
      else return false;
    }).catch(reject);

    if (isReserved) {
      if (!key) return resolve(UsernameStatus.RESERVED)
    }


    prisma.user.findFirst({ where: { username } }).then((user) => {
      
    });
  });
}