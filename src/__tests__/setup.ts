import dotenv from 'dotenv';
import { jest } from '@jest/globals';

// Load environment variables from .env.test or create mock ones for testing
dotenv.config({ path: '.env.test' });

// Mock environment variables if not set in .env.test
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.PORT = process.env.PORT || '3000';
process.env.HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || 'test_api_key';
process.env.LOG_LEVEL = process.env.LOG_LEVEL || 'error'; // Set to error to reduce noise in tests
process.env.RATE_LIMIT_WINDOW_MS = process.env.RATE_LIMIT_WINDOW_MS || '900000';
process.env.RATE_LIMIT_MAX = process.env.RATE_LIMIT_MAX || '100';

// Define mock for global fetch
const mockFetch = jest.fn() as jest.Mock;
global.fetch = mockFetch as unknown as typeof global.fetch;
