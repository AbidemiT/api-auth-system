import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { registerSchema } from "../utils/validation";
import { prismaClient } from "../libs";

import { JWT_SECRET } from "../config";


export const register = async (req: Request, res: Response) => {

  try {
    //validate input
    const parsedData = registerSchema.parse(req.body);

    const { email, password, name } = parsedData;

    //check if user already exists
    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(400)
        .json({
          success: "false",
          message: "User with the email already exists"
        });
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

    // generate JWT token
    const token = jwt.sign(
      { userId: newUser.id },
      JWT_SECRET || "api_auth_system_secret",
      { expiresIn: "7d" }
    );

    // Send response
    return res.status(201).json({
      success: "true",
      message: "User registered successfully",
      data: {
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
      },
    })

  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({
        success: "false",
        message: "Invalid input data",
        errors: error.errors,
      });
    }

    // Handle other errors
    console.error('Registration error:', error);
    res.status(500).json({
      success: "false",
      message: "Internal server error",
    });
  }
};