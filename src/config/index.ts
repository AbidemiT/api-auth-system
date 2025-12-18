import { config } from 'dotenv'


if (process.env.NODE_ENV !== 'production') {
  config();
}

export const {
  PORT,
  DATABASE_URL,
  JWT_SECRET,
  NODE_ENV,
} = process.env 