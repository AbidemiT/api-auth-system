import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginSchema, registerSchema } from "../utils/validation";
import { prismaClient } from "../libs";

import { JWT_SECRET } from "../config";
import { asyncHandler, AppError } from "../middleware/error.middleware";

import {
  generateAccessToken,
  generateRefreshToken,
  saveRefreshToken,
  verifyRefreshToken,
  deleteRefreshToken,
  deleteUserRefreshTokens
} from "../utils/token.utils";


export const register = asyncHandler(async (req: Request, res: Response) => {

  //validate input
  const parsedData = registerSchema.parse(req.body);

  const { email, password, name } = parsedData;

  //check if user already exists
  const existingUser = await prismaClient.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new AppError("User with this email already exists", 400);
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
  const newUser = await prismaClient.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    }
  });

  // generate tokens
  const accessToken = generateAccessToken(newUser.id, newUser.email);
  const refreshToken = await generateRefreshToken();

  // save refresh token
  await saveRefreshToken(newUser.id, refreshToken);

  // Send response
  return res.status(201).json({
    success: "true",
    message: "User registered successfully",
    data: {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
      token: accessToken,
      refreshToken,
    },
  })
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  // validate input
  const parsedData = loginSchema.parse(req.body);
  const { email, password } = parsedData;

  const user = await prismaClient.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 400);
  }

  // compare passwords
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 400);
  }

  // Generate token 
  const accessToken = generateAccessToken(user.id, user.email);
  const refreshToken = await generateRefreshToken();
  // Save refresh token
  await saveRefreshToken(user.id, refreshToken);

  // Send response
  return res.status(200).json({
    success: "true",
    message: "User logged in successfully",
    data: {
      token: accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    },
  });
});

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError("Refresh token is required", 400);
    }

    const userId = await verifyRefreshToken(refreshToken);

    if (!userId) {
      throw new AppError("Invalid or expired refresh token", 401);
    }

    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user.id, user.email);

    return res.status(200).json({
      success: "true",
      message: "Access token refreshed successfully",
      data: {
        token: newAccessToken,
      },
    });
  }
);

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError("Refresh token is required", 400);
  }

  // Delete the refresh token from database
  await deleteRefreshToken(refreshToken);

  return res.status(200).json({
    success: "true",
    message: "User logged out successfully",
  });
});

export const logoutAllDevices = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError("Unauthorized access", 401);
  }

  // Delete all refresh tokens for the user
  await deleteUserRefreshTokens(userId);

  return res.status(200).json({
    success: "true",
    message: "User logged out from all devices successfully",
  });
});