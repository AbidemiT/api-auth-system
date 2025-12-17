import { Request, Response } from "express";
import { prismaClient } from "../libs";

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    // req.user is populated by auth middleware
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: "false",
        message: "Unauthorized access",
      });
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
      return res.status(404).json({
        success: "false",
        message: "User not found",
      });
    }

    // Send user profile response
    return res.status(200).json({
      success: "true",
      message: "User profile fetched successfully",
      data: user,
    });

  } catch (error) {
    return res.status(500).json({
      success: "false",
      message: "An error occurred while fetching user profile",
    });
  }
}