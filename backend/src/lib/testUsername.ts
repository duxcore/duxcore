import { prisma } from "../util/prisma/instance";

export enum UsernameStatus {
  AVAILABLE,
  TAKEN,
  RESERVED,
  BANNED
}

export function testUsername(username: string, key?: string): Promise<UsernameStatus> {
  return new Promise((resolve, reject) => {

    (async () => {
      const isReserved = await prisma.reservedUsername.findFirst({
        where: {
          username
        }
      }).then(un /** username */ => {
        if (!un) return false;
        else return true;
      }).catch(reject);
    
      const isBanned = await await prisma.reservedUsername.findFirst({
        where: {
          username
        }
      }).then(un /** username */ => {
        if (!un) return false;
        else return true;
      }).catch(reject);
   
      if (isReserved) {
        if (!key) return resolve(UsernameStatus.RESERVED)
      }

      prisma.user.findFirst({ where: { username } }).then((user) => {
        if (!user) {
          if (isReserved) return resolve(UsernameStatus.RESERVED);
          if (isBanned) return resolve(UsernameStatus.BANNED);

          return resolve(UsernameStatus.AVAILABLE);
        }

        return resolve(UsernameStatus.TAKEN);
      });
    })();

  });
}