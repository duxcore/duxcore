import { prisma } from "../util/prisma/instance";
import * as uuid from 'uuid';

export default function reserveUsername(username) {
  const key = uuid.v4(); 

  return prisma.reservedUsername.create({
    data: {
      username: username,
      key
    }
  });
}