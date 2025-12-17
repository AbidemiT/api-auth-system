import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRoute from '../../src/routes/auth.routes';
import userRoute from '../../src/routes/user.routes';
import { errorHandler } from '../../src/middleware/error.middleware';

// Create an app instance for testing ( without starting the server )
export const createTestApp = (): Express => {
  const app: Express = express();

  // Middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/v1/auth', authRoute);
  app.use('/api/v1/user', userRoute);

  app.use(errorHandler);

  return app;
};
