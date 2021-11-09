import nodemailer from "nodemailer";
import { env } from "./env";

export let transport = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: false,
  auth: {
    user: env.smtp.user,
    pass: env.smtp.password
  }
})