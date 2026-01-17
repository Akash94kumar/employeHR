import { z } from 'zod';
import { UserRole } from './auth.types';

/**
 * WHAT: Request validation schemas using Zod
 * 
 * WHY: Validation at the request layer provides:
 * - Type safety for request bodies
 * - Automatic error messages
 * - Prevents invalid data from reaching business logic
 * - Single source of truth for validation rules
 * 
 * HOW: Zod schemas validate request bodies before they reach controller
 */

/**
 * WHAT: Login request validation schema
 * 
 * WHY: Validates email format and password presence before processing.
 * Prevents invalid requests from reaching database.
 * 
 * HOW: Zod schema with email and password validation
 */
export const loginSchema = z.object({
  // WHY: Email must be valid format - prevents invalid email addresses
  email: z
    .string()
    .email('Invalid email format')
    .toLowerCase()
    .trim(),

  // WHY: Password must be provided - required for authentication
  password: z.string().min(1, 'Password is required'),
});

/**
 * WHAT: Register request validation schema
 * 
 * WHY: Validates user registration data including role assignment.
 * Ensures all required fields are present and valid.
 * 
 * HOW: Zod schema with email, password, and role validation
 */
export const registerSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .toLowerCase()
    .trim(),

  // WHY: Strong password requirements prevent weak passwords
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),

  // WHY: Role must be valid enum value - prevents invalid roles
  role: z.nativeEnum(UserRole).optional().default(UserRole.EMPLOYEE),
});

/**
 * WHAT: Refresh token request validation schema
 * 
 * WHY: Validates refresh token is present in request.
 * Ensures token format before processing.
 * 
 * HOW: Zod schema with refresh token validation
 */
export const refreshTokenSchema = z.object({
  // WHY: Refresh token must be provided - required for token refresh
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

/**
 * WHAT: Type inference from validation schemas
 * 
 * WHY: TypeScript types inferred from Zod schemas ensure type safety.
 * Request handlers can use these types for type-safe request bodies.
 * 
 * HOW: z.infer extracts TypeScript types from Zod schemas
 */
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

