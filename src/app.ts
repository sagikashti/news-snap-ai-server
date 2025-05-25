import express from 'express';
import config from './config';
import { configureMiddleware } from './middleware/appMiddleware';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import summaryRoutes from './routes/summaryRoutes';
import logger from './utils/logger';

// Create Express app
const app = express();

// Configure middleware
configureMiddleware(app);

// API routes
app.use('/api', summaryRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: config.nodeEnv });
});

// Handle 404 errors
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
