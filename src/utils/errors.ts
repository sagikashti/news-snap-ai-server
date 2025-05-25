// Base application error class
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 - Bad Request
export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}

// 401 - Unauthorized
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

// 403 - Forbidden
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

// 404 - Not Found
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

// 429 - Too Many Requests
export class TooManyRequestsError extends AppError {
  constructor(message = 'Too many requests, please try again later') {
    super(message, 429);
  }
}

// 500 - Internal Server Error
export class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, 500);
  }
}

// 503 - Service Unavailable
export class ServiceUnavailableError extends AppError {
  constructor(message = 'Service unavailable') {
    super(message, 503);
  }
}

// External API error
export class ExternalAPIError extends AppError {
  constructor(message = 'External API error', statusCode = 502) {
    super(message, statusCode);
  }
}
