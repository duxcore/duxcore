import { prismaInstance } from "../../prisma/instance";
import UserManager from "../classes/UserManager";

export const users = {
  async fetch(id: string): Promise<UserManager | null> {
    let rawUser = await prismaInstance.user.findFirst({
      where: { id }
    });

    if (rawUser == null) return null;
    return new UserManager(rawUser);
  },

  async count(): Promise<number> {
    return await prismaInstance.user.count();
  }
}