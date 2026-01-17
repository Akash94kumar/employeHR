import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

/**
 * WHAT: Request validation middleware factory
 * 
 * WHY: Centralized validation middleware provides:
 * - Reusable validation logic
 * - Consistent error format
 * - Type-safe request bodies
 * - Automatic error handling
 * 
 * HOW: Factory function that returns Express middleware
 */

/**
 * WHAT: Validation middleware factory
 * 
 * WHY: Factory pattern allows creating middleware for different schemas.
 * Each route can use its own validation schema.
 * 
 * HOW: Returns Express middleware that validates request body against schema
 */
export function validateRequest(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // WHY: Validate request body against Zod schema
      // If validation fails, Zod throws error with details
      const validated = schema.parse(req.body);

      // WHY: Replace req.body with validated data
      // This ensures type safety and removes any extra fields
      req.body = validated;

      // WHY: Continue to next middleware/controller
      next();
    } catch (error) {
      // WHY: Handle Zod validation errors
      if (error instanceof z.ZodError) {
        // WHY: Return 400 Bad Request with validation errors
        res.status(400).json({
          success: false,
          error: {
            message: 'Validation failed',
            details: error.errors.map((err) => ({
              path: err.path.join('.'),
              message: err.message,
            })),
          },
        });
        return;
      }

      // WHY: Pass other errors to error middleware
      next(error);
    }
  };
}

