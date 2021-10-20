import dotenv from 'dotenv';

dotenv.config();

export const env = {
  apiServerPort: process.env.API_SERVER_PORT
}
