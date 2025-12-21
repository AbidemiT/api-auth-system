import { PrismaClient } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";

import { Pool } from "pg";

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create adapter
const adapter = new PrismaPg(pool);

// Create Prisma Client with adapter
const prismaClient = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

async function main() {
  console.log("🌱 Starting database seed...");

  // Check if already seeded
  const existingCount = await prisma.resource.count();
  if (existingCount > 0) {
    console.log(
      `⚠️ Database already has ${existingCount} resources. Skipping seed.`
    );
    return;
  }

  // Seed Conference Room A
  await prismaClient.resource.create({
    data: {
      name: "Conference Room A",
      type: "MEETING_ROOM",
      description: "Spacious meeting room with projector and whiteboard",
      pricePerHour: 2000,
      pricePerHalfDay: 7000,
      pricePerFullDay: 12000,
      maxDuration: 480,
      isActive: true,
      availability: {
        create: [
          { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
          { dayOfWeek: 2, startTime: "09:00", endTime: "17:00" },
          { dayOfWeek: 3, startTime: "09:00", endTime: "17:00" },
          { dayOfWeek: 4, startTime: "09:00", endTime: "17:00" },
          { dayOfWeek: 5, startTime: "09:00", endTime: "17:00" },
          { dayOfWeek: 6, startTime: "10:00", endTime: "16:00" },
        ],
      },
    },
  });
  console.log("✅ Seeded Conference Room A");

  // Seed Hot Desk
  await prismaClient.resource.create({
    data: {
      name: "Hot Desk",
      type: "DESK_SPACE",
      description: "Flexible workspace with WiFi and power outlets",
      pricePerHour: 500,
      pricePerHalfDay: 2000,
      pricePerFullDay: 3500,
      maxDuration: 720,
      isActive: true,
      availability: {
        create: [
          { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
          { dayOfWeek: 2, startTime: "09:00", endTime: "17:00" },
          { dayOfWeek: 3, startTime: "09:00", endTime: "17:00" },
          { dayOfWeek: 4, startTime: "09:00", endTime: "17:00" },
          { dayOfWeek: 5, startTime: "09:00", endTime: "17:00" },
          { dayOfWeek: 6, startTime: "10:00", endTime: "16:00" },
        ],
      },
    },
  });
  console.log("✅ Seeded Hot Desk");

  // Seed Content Studio
  await prismaClient.resource.create({
    data: {
      name: "Content Studio",
      type: "STUDIO",
      description: "Fully equipped studio for video/audio production",
      pricePerHour: 5000,
      pricePerHalfDay: 18000,
      pricePerFullDay: 30000,
      maxDuration: 480,
      isActive: true,
      availability: {
        create: [
          { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
          { dayOfWeek: 2, startTime: "09:00", endTime: "17:00" },
          { dayOfWeek: 3, startTime: "09:00", endTime: "17:00" },
          { dayOfWeek: 4, startTime: "09:00", endTime: "17:00" },
          { dayOfWeek: 5, startTime: "09:00", endTime: "17:00" },
          { dayOfWeek: 6, startTime: "10:00", endTime: "16:00" },
        ],
      },
    },
  });
  console.log("✅ Seeded Content Studio");

  console.log("✨ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
