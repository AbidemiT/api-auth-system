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
import { initSentry, Sentry } from './libs/sentry';

import bookingRoutes from './routes/booking.routes';
import resourceRoutes from './routes/resource.routes';

if (process.env.NODE_ENV !== 'production') {
  config();
}

import { NODE_ENV, DATABASE_URL, JWT_SECRET, PORT } from './config';

// Initiate Sentry first
initSentry();

const app = express();


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

// Sentry error handler
Sentry.setupExpressErrorHandler(app);

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
    // Connect to database before starting server
    console.log('🔌 Connecting to database...');
    await prismaClient.$connect();
    console.log('✅ Database connected successfully');


    // Start the HTTP server
    const server = app.listen(portNumber, '0.0.0.0', () => {
      console.log(`🚀 Server is running on http://0.0.0.0:${portNumber}`);
      console.log(`📝 Environment: ${NODE_ENV}`);
      console.log(`✅ API is ready to accept requests`);
    });

    // Handle graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);

      // stop accepting new connections
      server.close(async () => {
        console.log('🛑 HTTP server closed (no new connections accepted)');

        try {
          // Close Sentry
          console.log('🛑 Closing Sentry...');
          await Sentry.close(2000); // Wait up to 2 seconds

          // close database connection
          await prismaClient.$disconnect();
          console.log('🛑 Database connection closed');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error during shutdown:', error);
          Sentry.captureException(error); // Log to Sentry
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds if graceful shutdown takes too long
      setTimeout(() => {
        console.error('❌ Could not close connections in time, forcing shutdown');
        process.exit(1);
      }, 10000);
    };

    // handle termination signals from hosting platform
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Catch unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      // Application specific logging, throwing an error, or other logic here

      // Send to Sentry
      Sentry.captureException(reason);

      shutdown('unhandledRejection');
    });

    // Catch uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      console.error('❌ Uncaught Exception thrown:', error.name);
      console.error('❌ Error message:', error.message);
      console.error('❌ Stack trace:', error.stack);

      // Application specific logging, throwing an error, or other logic here
      Sentry.captureException(error);

      shutdown('uncaughtException');
    });

  } catch (err) {
    console.error('❌ Server startup failed:', err);
    try {
      await prismaClient.$disconnect();
    } catch (disconnectError) {
      console.error('❌ Failed to disconnect from database after startup failure:', disconnectError);
    }

    process.exit(1);
  }
})();