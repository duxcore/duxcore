import Password from "../classes/Password";
import User from "../classes/User";
import { NewUserData } from "../types/user";
import { prisma } from "../util/prisma/instance";

export function createUser(data: NewUserData): Promise<User> {
  return new Promise((resolve, reject) => {
    prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        username: data.username,
        password: JSON.stringify(Password.hash(data.password)),
      },
    });
  });
}
