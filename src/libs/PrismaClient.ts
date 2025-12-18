import { PrismaClient } from "../../prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { DATABASE_URL } from "../config";


import { Pool } from 'pg';


// Create connection pool
const pool = new Pool({
  connectionString: DATABASE_URL,
});

// Create adapter
const adapter = new PrismaPg(pool);

// Create Prisma Client with adapter
const prismaClient = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export { prismaClient };
