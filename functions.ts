import * as functions from 'firebase-functions';
import app from './src/app';

// Set default environment variables for Firebase Functions
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || '3000';
process.env.LOG_LEVEL = process.env.LOG_LEVEL || 'info';
process.env.RATE_LIMIT_WINDOW_MS = process.env.RATE_LIMIT_WINDOW_MS || '900000';
process.env.RATE_LIMIT_MAX = process.env.RATE_LIMIT_MAX || '100';

// Export the Express app as a Firebase Function
export const api = functions.https.onRequest(app);
