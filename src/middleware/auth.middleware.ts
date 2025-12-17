import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config';

// Extend Express Request type to include user

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: "false",
        message: "Access token is missing",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET as string) as { userId: string; email: string };

    // Attach user info to request object
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({
      success: "false",
      message: "Invalid or expired token",
    });
  }
}