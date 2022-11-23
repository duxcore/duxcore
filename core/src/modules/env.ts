import dotenv from 'dotenv';

dotenv.config();

let penv = process.env
export const env = {
  smtp: {
    host: penv.SMTP_HOST,
    port: parseInt(penv.SMTP_PORT ?? "0"),
    user: penv.SMTP_USER,
    password: penv.SMTP_PASSWORD
  },
  dashUrl: penv.DASH_URL
}
