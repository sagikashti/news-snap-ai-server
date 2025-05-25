import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';
import config from '../config';

// Global error handling middleware
export const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  // Log the error
  logger.error(`${err.name}: ${err.message}`, {
    path: req.path,
    method: req.method,
    stack: config.isDevelopment ? err.stack : undefined,
  });

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      status: 'error',
      message: 'Validation error',
      errors: err.errors,
    });
    return;
  }

  // Handle operational errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
    return;
  }

  // Handle unknown errors
  const statusCode = 500;
  const message = config.isDevelopment ? err.message : 'Something went wrong, please try again later';

  res.status(statusCode).json({
    status: 'error',
    message,
  });
};

// 404 handler for undefined routes
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    status: 'error',
    message: `Cannot ${req.method} ${req.path}`,
  });
};
