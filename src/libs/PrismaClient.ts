import { PrismaClient } from "../../prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { DATABASE_URL } from "../config";

const adapter = new PrismaPg({
  connectionString: DATABASE_URL || "",
})

const prismaClient = new PrismaClient({ adapter });

export { prismaClient };
