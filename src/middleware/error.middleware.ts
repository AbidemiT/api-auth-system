import { Request, Response, NextFunction } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { ZodError } from "zod";

import { NODE_ENV } from "../config";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: any = undefined;

  // Handle custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Handle Zod validation errors
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    const { fieldErrors } = err.flatten();
    errors = fieldErrors;
  }

  // handle Prisma errors
  else if (err instanceof PrismaClientKnownRequestError) {
    statusCode = 400;

    if (err.code === 'P2002') {
      message = "A record with this unique field already exists.";
    } else if (err.code === "P2025") {
      message = "The requested record was not found.";
    } else {
      message = "Database Error";
    }
  }

  // handle jwt errors
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // log the error for debugging
  console.error("Error: ", {
    message: err.message,
    stack: err.stack,
    statusCode,
  });

  // Send error response
  res.status(statusCode).json({
    success: "false",
    message,
    ...(errors && { errors }),
    ...(NODE_ENV === "development" && { stack: err.stack }),
  });
};

// Async handler wrapper to catch errors in async functions
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};