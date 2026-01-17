import { Request, Response, NextFunction } from 'express';

/**
 * WHAT: Centralized error handling middleware
 * 
 * WHY: Centralized error handling provides:
 * - Consistent error response format
 * - Single place to modify error handling logic
 * - Better error logging and monitoring
 * - Prevents error details from leaking to clients in production
 * 
 * HOW: Express error middleware (4 parameters) catches all errors
 */

/**
 * WHAT: Custom error interface for application errors
 * 
 * WHY: Typed errors provide:
 * - Type safety
 * - Consistent error structure
 * - Better error handling
 * 
 * HOW: Extends Error with status code and optional details
 */
export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

/**
 * WHAT: Error handling middleware function
 * 
 * WHY: Express requires error middleware to have 4 parameters (err, req, res, next)
 * This middleware catches all errors thrown in routes or other middlewares
 * 
 * HOW: Checks error type and returns appropriate HTTP response
 */
export function errorMiddleware(
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // WHY: Default to 500 if status code not set (unknown errors)
  const statusCode = (err as AppError).statusCode || 500;
  
  // WHY: In production, don't expose error details to clients (security)
  // In development, show full error for debugging
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // WHY: Log error for monitoring and debugging
  console.error('Error:', {
    message: err.message,
    stack: isDevelopment ? err.stack : undefined,
    statusCode,
    path: req.path,
    method: req.method,
  });

  // WHY: Consistent error response format helps frontend error handling
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal server error',
      // WHY: Only include stack trace in development
      ...(isDevelopment && { stack: err.stack }),
    },
    // WHY: Include timestamp for error tracking
    timestamp: new Date().toISOString(),
  });
}

