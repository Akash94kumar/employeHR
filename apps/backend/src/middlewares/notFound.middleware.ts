import { Request, Response, NextFunction } from 'express';

/**
 * WHAT: 404 Not Found middleware
 * 
 * WHY: Handles requests to non-existent routes:
 * - Provides consistent 404 response format
 * - Better UX than default Express 404
 * - Allows logging of 404 requests for monitoring
 * 
 * HOW: Middleware that runs after all routes, catches unmatched requests
 */

/**
 * WHAT: 404 handler function
 * 
 * WHY: This middleware should be added AFTER all routes.
 * If a request doesn't match any route, it reaches this middleware
 * and returns a 404 response.
 * 
 * HOW: Creates an error and passes it to error middleware
 */
export function notFoundMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // WHY: Log 404 requests for monitoring (might indicate broken links, etc.)
  console.warn(`404 - Route not found: ${req.method} ${req.path}`);

  // WHY: Create error object that error middleware can handle
  const error: Error = new Error(`Route not found: ${req.method} ${req.path}`);
  (error as any).statusCode = 404;
  
  // WHY: Pass error to error middleware for consistent error handling
  next(error);
}

