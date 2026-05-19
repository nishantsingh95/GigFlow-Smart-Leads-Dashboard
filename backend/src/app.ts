import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import leadRoutes from './routes/lead.routes';
import { sendError } from './utils/response';

const app: Application = express();

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'GigFlow API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

app.use((_req: Request, res: Response) => {
  sendError(res, 404, 'Route not found');
});

app.use(errorHandler);

export default app;
