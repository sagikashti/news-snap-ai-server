import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import config from '../config';

/**
 * Configure Express application middleware
 */
export function configureMiddleware(app: Express): void {
  // Basic security headers
  app.use(helmet());

  // Enable CORS
  app.use(cors());

  // Parse JSON request bodies
  app.use(express.json({ limit: '1mb' }));

  // Parse URL-encoded request bodies
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Compress responses
  app.use(compression());

  // Rate limiting
  app.use(
    rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.max,
      standardHeaders: true,
      legacyHeaders: false,
      message: 'Too many requests from this IP, please try again later.',
    })
  );

  // Trust proxies if in production
  if (config.isProduction) {
    app.set('trust proxy', 1);
  }
}
