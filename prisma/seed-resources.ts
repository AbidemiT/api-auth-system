import { prismaClient } from '../src/libs/prismaClient';
import { ResourceType } from './generated/prisma/client';

async function main() {
  // Meeting Rooms
  const meetingRoom = await prismaClient.resource.create({
    data: {
      name: 'Conference Room A',
      type: ResourceType.MEETING_ROOM,
      description: 'Spacious meeting room with projector and whiteboard',
      pricePerHour: 2000,
      pricePerHalfDay: 7000,
      pricePerFullDay: 12000,
      maxDuration: 480, // 8 hours
      availability: {
        create: [
          // Monday - Friday: 9 AM - 5 PM
          { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
          // Saturday: 10 AM - 4 PM
          { dayOfWeek: 6, startTime: '10:00', endTime: '16:00' },
        ],
      },
    },
  });

  // Desk Space
  const deskSpace = await prismaClient.resource.create({
    data: {
      name: 'Hot Desk',
      type: ResourceType.DESK_SPACE,
      description: 'Flexible workspace with WiFi and power outlets',
      pricePerHour: 500,
      pricePerHalfDay: 2000,
      pricePerFullDay: 3500,
      maxDuration: 720, // 12 hours
      availability: {
        create: [
          { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 6, startTime: '10:00', endTime: '16:00' },
        ],
      },
    },
  });

  // Studio
  const studio = await prismaClient.resource.create({
    data: {
      name: 'Content Studio',
      type: ResourceType.STUDIO,
      description: 'Fully equipped studio for video/audio production',
      pricePerHour: 5000,
      pricePerHalfDay: 18000,
      pricePerFullDay: 30000,
      maxDuration: 480, // 8 hours
      availability: {
        create: [
          { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
          { dayOfWeek: 6, startTime: '10:00', endTime: '16:00' },
        ],
      },
    },
  });

  console.log('✅ Resources seeded:', { meetingRoom, deskSpace, studio });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });