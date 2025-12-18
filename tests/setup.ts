import { prismaClient } from "../src/libs";

// Setup: run before all tests
export const setTestDB = async () => {
  // clean databse before tests
  await prismaClient.user.deleteMany({});
}

// Teardown: run after all tests
export const tearDownTestDB = async () => {
  // clean databse after tests
  await prismaClient.$disconnect();
}

// Helper to create a test user
export const createTestUser = async (email = 'test@example.com') => {
  const bcrypt = require('bcryptjs');
  const password = await bcrypt.hash('Password123!', 10);

  return await prismaClient.user.create({
    data: {
      email,
      password,
      name: 'Test User',
    },
  });
}

// Clean up function for after each test
export const cleanupTestDB = async () => {
  await prismaClient.user.deleteMany({});
};