import { config } from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  config();
}

// Ensure PORT is defined with a fallback
export const PORT = process.env.PORT || 3001;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const DATABASE_URL = process.env.DATABASE_URL;
export const DIRECT_URL = process.env.DIRECT_URL;
export const JWT_SECRET = process.env.JWT_SECRET;