import { Request, Response } from "express";
import { prismaClient } from "../libs";

import { asyncHandler, AppError } from "../middleware/error.middleware";
import { th } from "zod/v4/locales";

export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  // req.user is populated by auth middleware
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError("Unauthorized access", 401);
  }

  // Fetch user profile from database
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Send user profile response
  return res.status(200).json({
    success: "true",
    message: "User profile fetched successfully",
    data: user,
  });
});