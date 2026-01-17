/**
 * WHAT: Validation schemas for Admin HR Management endpoints
 * 
 * WHY: Request validation ensures data integrity and security.
 * Prevents invalid data from reaching business logic layer.
 * 
 * HOW: Zod schemas for validating request bodies
 */

import { z } from 'zod';

/**
 * WHAT: Create HR user validation schema
 * 
 * WHY: Validates HR creation requests.
 * Ensures email is valid, name is present, password is strong (if provided).
 * 
 * HOW: Zod schema with email, name, and optional password validation
 */
export const createHrSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .toLowerCase()
    .trim()
    .min(1, 'Email is required'),

  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),

  // WHY: Password is optional - if not provided, will be auto-generated
  // If provided, must meet security requirements
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
    .optional(),
});

/**
 * WHAT: Update HR status validation schema
 * 
 * WHY: Validates status update requests.
 * Ensures isActive is a boolean value.
 * 
 * HOW: Zod schema with boolean validation
 */
export const updateHrStatusSchema = z.object({
  isActive: z.boolean({
    required_error: 'isActive is required',
    invalid_type_error: 'isActive must be a boolean',
  }),
});

/**
 * WHAT: Type exports for TypeScript
 * 
 * WHY: Type-safe request bodies in controllers.
 * 
 * HOW: Infer types from Zod schemas
 */
export type CreateHrInput = z.infer<typeof createHrSchema>;
export type UpdateHrStatusInput = z.infer<typeof updateHrStatusSchema>;

