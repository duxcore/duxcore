import { UserRole } from ".prisma/client";
import { prismaInstance } from "../../prisma/instance";
import Password from "../classes/Password";
import UserManager from "../classes/UserManager";
import jwt from "jsonwebtoken"
import fs from 'fs';

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
        password: data.password,

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

  async generateJWT(id: string): Promise<string | null> {
    const user = await prismaInstance.user.findFirst({
      where: {
        id
      }
    });

    if (!user) return null;

    return jwt.sign({
      id,
      timestamp: new Date().getTime()
    }, fs.readFileSync(`${__dirname}/${__filename.endsWith('.js') ? "../" : ""}../../jwt.key`))
  },

  async login(email: string, password: string, ip: string) {
    let passwordValid = false;
    const emailExists = (await prismaInstance.user.count({
      where: {
        email
      }
    })) == 1;

    if (emailExists) passwordValid = await Password.validate(password, (await prismaInstance.user.findFirst({
      where: {
        email
      }
    }))?.password as string);

    if (emailExists) await prismaInstance.userLoginAttempts.create({
      data: {
        userId: (await prismaInstance.user.findFirst({ where: { email } }))?.id as string,
        ip,
        accepted: passwordValid,
        denialReason: (() => {
          if (!emailExists) return "Unknown User";
          if (!passwordValid) return "Invalid Password";
          return undefined;
        })()
      }
    }).catch(e => { throw e; })

    return {
      jwt: passwordValid ? await this.generateJWT((await prismaInstance.user.findFirst({ where: { email } }))?.id as string) : null,
      emailExists,
      passwordValid,
      userId: (await prismaInstance.user.findFirst({
        where: {
          email
        }
      }))?.id ?? null
    }
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