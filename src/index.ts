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
import { NODE_ENV } from './config';

if (process.env.NODE_ENV !== 'production') {
  config();
}

console.log('🔧 Starting application...');
console.log('📝 NODE_ENV:', process.env.NODE_ENV);
console.log('🔌 DATABASE_URL:', process.env.DATABASE_URL ? 'Set ✓' : 'Missing ✗');
console.log('🔑 JWT_SECRET:', process.env.JWT_SECRET ? 'Set ✓' : 'Missing ✗');


const app = express();
const PORT = process.env.PORT || 3000;

try {

  console.log('⚙️  Configuring middleware...');

  // Middleware to parse JSON bodies
  app.use(helmet());
  app.use(cors());

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

  app.listen(PORT, async () => {
    await prismaClient.$connect();
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📝 Environment: ${NODE_ENV || 'development'}`);
    console.log(`✅ API is ready to accept requests`);
  });
} catch (error) {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
}