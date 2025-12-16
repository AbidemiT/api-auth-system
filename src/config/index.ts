import { config } from 'dotenv'

config();

export const {
  PORT,
  DATABASE_URL,
  JWT_SECRET,
  NODE_ENV,
} = process.env 