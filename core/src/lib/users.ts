import { UserRole } from ".prisma/client";
import { prismaInstance } from "../../prisma/instance";
import Password from "../classes/Password";
import UserManager from "../classes/UserManager";
import { apiError, errorManifest } from "../helpers/apiError";
import { cryptr } from "../util/cryptr";
import { emailResetComplete } from "../util/emailTemplates/emailResetComplete";
import { emailResetConfirmation } from "../util/emailTemplates/emailResetConfirmation";
import { env } from "../util/env";
import { sendEmail, transport } from "../util/mailer";
import { authorizationToken } from "./authorizationTokens";

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
      authorization: passwordValid ? await authorizationToken.generateTokenPair({
        userId: (await prismaInstance.user.findFirst({ where: { email } }))?.id as string
      }) : null,
      emailExists,
      passwordValid,
      userId: (await prismaInstance.user.findFirst({
        where: {
          email
        }
      }))?.id ?? null
    }
  },

  async generateEmailResetToken(userId: string, newEmail: string) {
    let usr = await users.fetch(userId);
    let emailExists = await users.emailExists(newEmail);

    if (!usr) throw new Error("INVALID_USER_ID");
    if (emailExists) throw new Error("EMAIL_EXISTS");

    let encryptedEmail = cryptr.encrypt(newEmail);
    let resetToken = await prismaInstance.userEmailResetTokens.create({
      data: {
        userId,
        email: encryptedEmail
      }
    });

    let resetUrl = `${env.dashUrl}/reset-email?token=${resetToken.token}&email=${encryptedEmail}`;
    let emailTemplate = emailResetConfirmation({
      confirmationUrl: resetUrl
    });

    await sendEmail([newEmail], emailTemplate, "Confirm your new email address!");
    return;
  },

  async validateEmailResetToken(token: string, encryptedEmail: string, password: string) {
    let tokenData = await prismaInstance.userEmailResetTokens.findFirst({
      where: {
        token: token
      }
    });

    if (!tokenData) throw errorManifest.invalidEmailResetToken;
    if (tokenData.email !== encryptedEmail) throw errorManifest.invalidEmailTokenMatch;

    let newEmail = cryptr.decrypt(encryptedEmail);
    let oldEmail;
    let user = await this.fetch(tokenData.userId);

    oldEmail = user?.email;

    if (!user) return errorManifest.unknownUser
    if (!user?.validatePassowrd(password)) throw errorManifest.invalidPassword

    await user.updateEmail(newEmail);
    await sendEmail([
      oldEmail,
      newEmail
    ],
      emailResetComplete({}),
      "Your email address has been reset successfully!"
    );
    return;
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