import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginSchema, registerSchema } from "../utils/validation";
import { prismaClient } from "../libs";

import { JWT_SECRET } from "../config";
import { asyncHandler, AppError } from "../middleware/error.middleware";


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

  // generate JWT token
  const token = jwt.sign(
    { userId: user.id },
    JWT_SECRET || "api_auth_system_secret",
    { expiresIn: "7d" }
  );

  // Send response
  return res.status(200).json({
    success: "true",
    message: "User logged in successfully",
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    },
  });
});