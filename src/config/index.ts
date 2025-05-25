import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Define environment variables schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  HUGGINGFACE_API_KEY: z.string({
    required_error: 'HUGGINGFACE_API_KEY is required in the .env file',
  }),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('info'),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'), // 15 minutes in milliseconds
  RATE_LIMIT_MAX: z.string().default('100'),
});

// Validate and extract the environment variables
const env = envSchema.safeParse(process.env);

// Handle validation errors
if (!env.success) {
  console.error('❌ Invalid environment variables:', env.error.format());
  throw new Error('Invalid environment variables');
}

// Create the config object with validated values
export const config = {
  nodeEnv: env.data.NODE_ENV,
  port: parseInt(env.data.PORT, 10),
  huggingface: {
    apiKey: env.data.HUGGINGFACE_API_KEY,
    model: 'facebook/bart-large-cnn',
  },
  logger: {
    level: env.data.LOG_LEVEL,
  },
  rateLimit: {
    windowMs: parseInt(env.data.RATE_LIMIT_WINDOW_MS, 10),
    max: parseInt(env.data.RATE_LIMIT_MAX, 10),
  },
  isDevelopment: env.data.NODE_ENV === 'development',
  isProduction: env.data.NODE_ENV === 'production',
  isTest: env.data.NODE_ENV === 'test',
};

export default config;
