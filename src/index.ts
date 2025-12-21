import { config } from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import { errorHandler } from './middleware/error.middleware';
import { apiLimiter } from './middleware/rateLimiter.middleware';

import { prismaClient } from './libs';

import bookingRoutes from './routes/booking.routes';
import resourceRoutes from './routes/resource.routes';

if (process.env.NODE_ENV !== 'production') {
  config();
}

import { NODE_ENV, DATABASE_URL, JWT_SECRET, PORT } from './config';

const app = express();

try {

  console.log('⚙️  Configuring middleware...');

  // Middleware to parse JSON bodies
  app.use(helmet());
  app.use(cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://abit-hub-frontend.vercel.app',
      'https://*.vercel.app'
    ],
    credentials: true,
  }));

  // Logging middleware
  if (NODE_ENV === "development") {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }

  // Body parser middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Apply global rate limiting middleware
  app.use("/api/v1", apiLimiter);

  console.log('🛣️  Registering routes...');

  // Basic route
  app.get('/health', (req: Request, res: Response) => {
    res.json({
      status: 'OK',
      message: 'API is running',
      timeStamp: new Date().toISOString(),
      environment: NODE_ENV || 'development',
    });
  });

  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/user', userRoutes);
  app.use('/api/v1/bookings', bookingRoutes);
  app.use('/api/v1/resources', resourceRoutes);

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: "false",
      message: "Route not found"
    });
  });

  // Error handling middleware (should be the last middleware)
  app.use(errorHandler);

  console.log('🎧 Starting server on port', PORT);

  // Ensure PORT is cast to a number for the listener
  const portNumber = Number(PORT);

  // Connect to the database before starting the HTTP server so startup
  // failures are visible immediately in the logs and the platform can
  // surface the error (the host will show a non-zero exit code).
  (async () => {
    try {
      await prismaClient.$connect();
      console.log(`🚀 Database connected`);
    } catch (err) {
      console.error('❌ Failed to connect to database during startup:', err);
      process.exit(1);
    }

    app.listen(portNumber, '0.0.0.0', () => {
      console.log(`🚀 Server is running on http://0.0.0.0:${portNumber}`);
      console.log(`📝 Environment: ${NODE_ENV}`);
      console.log(`✅ API is ready to accept requests`);
    });
  })();
} catch (error) {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
}