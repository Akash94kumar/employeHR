import { Response } from 'express';

/**
 * WHAT: Standardized API response utility
 * 
 * WHY: Consistent response format provides:
 * - Predictable API structure
 * - Easy error handling on frontend
 * - Better developer experience
 * - Standard REST API pattern
 * 
 * HOW: Utility functions for success and error responses
 */

/**
 * WHAT: Success response interface
 * 
 * WHY: Type-safe success response structure.
 * Ensures all success responses follow same format.
 * 
 * HOW: TypeScript interface for success responses
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

/**
 * WHAT: Error response interface
 * 
 * WHY: Type-safe error response structure.
 * Ensures all error responses follow same format.
 * 
 * HOW: TypeScript interface for error responses
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: any;
  };
}

/**
 * WHAT: Send success response
 * 
 * WHY: Standardized success response format.
 * All successful API calls return same structure:
 * {
 *   success: true,
 *   data: {...}
 * }
 * 
 * HOW: Express response helper function
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  message?: string,
): void {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
  };

  // WHY: Optional message for additional context
  if (message) {
    response.message = message;
  }

  res.status(statusCode).json(response);
}

/**
 * WHAT: Send error response
 * 
 * WHY: Standardized error response format.
 * All errors return same structure:
 * {
 *   success: false,
 *   error: {
 *     message: "...",
 *     code: "...",
 *     details: {...}
 *   }
 * }
 * 
 * HOW: Express response helper function
 */
export function sendError(
  res: Response,
  message: string,
  statusCode: number = 400,
  code?: string,
  details?: any,
): void {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      message,
    },
  };

  // WHY: Optional error code for programmatic error handling
  if (code) {
    response.error.code = code;
  }

  // WHY: Optional details for additional error information
  if (details) {
    response.error.details = details;
  }

  res.status(statusCode).json(response);
}

/**
 * WHAT: Send paginated response
 * 
 * WHY: Standardized pagination response format.
 * Used for list endpoints with pagination.
 * 
 * HOW: Express response helper for paginated data
 */
export function sendPaginated<T>(
  res: Response,
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  },
  statusCode: number = 200,
): void {
  const response: ApiSuccessResponse<{
    items: T[];
    pagination: typeof pagination;
  }> = {
    success: true,
    data: {
      items: data,
      pagination,
    },
  };

  res.status(statusCode).json(response);
}

