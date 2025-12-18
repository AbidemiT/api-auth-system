import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { JWT_SECRET } from '../config';
import { prismaClient } from '../libs';

const ACCESS_TOKEN_EXPIRES_IN = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRES_IN = 7 * 24 * 60 * 1000; // 7 days in milliseconds

export const generateAccessToken = (
  userId: string,
  email: string):
  string => {
  return jwt.sign({
    userId,
    email
  }, JWT_SECRET as string,
    {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN
    }
  );
};

export const generateRefreshToken = async (): Promise<string> => {
  return crypto.randomBytes(40).toString('hex');
};

export const saveRefreshToken = async (userId: string, token: string): Promise<void> => {
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN);

  await prismaClient.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt
    },
  });
};

export const verifyRefreshToken = async (token: string): Promise<string | null> => {
  const refreshToken = await prismaClient.refreshToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!refreshToken) {
    return null;
  }

  // Check if token is expired
  if (refreshToken.expiresAt < new Date()) {
    // Delete expired token
    await prismaClient.refreshToken.delete({
      where: {
        id: refreshToken.id
      }
    });

    return null;
  }

  return refreshToken.userId;
};

export const deleteRefreshToken = async (token: string): Promise<void> => {
  await prismaClient.refreshToken.deleteMany({
    where: { token },
  });
};

export const deleteUserRefreshTokens = async (userId: string): Promise<void> => {
  await prismaClient.refreshToken.deleteMany({
    where: { userId },
  });
};