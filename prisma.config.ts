import { config } from 'dotenv'
import { defineConfig, env } from 'prisma/config'

// Load local .env during development only. In production the environment
// variables should be provided by the host (CI/container/platform).
if (process.env.NODE_ENV !== 'production') {
  config();
}

import { DATABASE_URL, DIRECT_URL } from './src/config'

export default defineConfig({
  // the main entry for your schema
  schema: 'prisma/schema.prisma',
  // where migrations should be generated
  // what script to run for "prisma db seed"
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  // The database URL 
  datasource: {
    // Type Safe env() helper 
    // Does not replace the need for dotenv
    url: DATABASE_URL!,
    directUrl: DIRECT_URL!,
  },
})