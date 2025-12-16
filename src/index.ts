import { config } from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';

import { prismaClient } from './libs';

config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic route
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'API is running',
    timeStamp: new Date().toISOString(),
  });
});

app.use('/api/v1/auth', authRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: "false",
    message: "Route not found"
  });
});

app.listen(PORT, async () => {
  await prismaClient.$connect();
  console.log(`Server is running on port ${PORT}`);
});