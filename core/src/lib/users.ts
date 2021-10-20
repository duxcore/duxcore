import { Prisma, User, UserRole } from ".prisma/client";
import { create } from "domain";
import { exists } from "fs";
import { prismaInstance } from "../../prisma/instance";
import UserManager from "../classes/UserManager";

interface NewUserData {
  firstName: string;
  lastName: string;

  email: string;
  password: string;

  role: UserRole;
  isStaff?: boolean;
  emailVerified?: boolean;
}

export const users = {
  async fetch(id: string): Promise<UserManager | null> {
    let rawUser = await prismaInstance.user.findFirst({
      where: { id }
    });

    if (rawUser == null) return null;
    return new UserManager(rawUser);
  },

  async create(data: NewUserData) {
    const user = (await prismaInstance.user.create({
      data: {
        email: data.email,

        firstName: data.firstName,
        lastName: data.lastName,

        role: data.role,

        meta_tags: {
          create: {
            isStaff: data.isStaff,
            emailVerified: data.emailVerified
          }
        }
      }
    }));

    return new UserManager(user);
  },

  async emailExists(email: string) {
    let test = await prismaInstance.user.findFirst({
      where: {
        email
      }
    });

    if (!test) return false;
    return true;
  },

  async count(): Promise<number> {
    return await prismaInstance.user.count();
  }
}