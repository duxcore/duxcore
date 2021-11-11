import { prismaInstance } from "../../prisma/instance";
import { cryptr } from "../util/cryptr";
import { emailResetConfirmation } from "../util/emailTemplates/emailResetConfirmation";
import { env } from "../util/env";
import { sendEmail, transport } from "../util/mailer";
import { users } from "./users"

export const emails = {
  async createResetToken(userId: string, newEmail: string) {
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
  }
}