import dotenv from 'dotenv';
import { z } from 'zod';

/**
 * WHAT: Environment variable validation and loading
 * 
 * WHY: Environment variables are critical for application configuration.
 * Validating them at startup prevents runtime errors and provides clear
 * error messages if required variables are missing or invalid.
 * 
 * HOW: Uses zod for schema validation and dotenv for loading .env files
 */

// WHY: Load environment variables from .env file before validation
dotenv.config();

/**
 * WHAT: Environment variable schema definition
 * 
 * WHY: Zod schema provides:
 * - Type safety for environment variables
 * - Runtime validation
 * - Clear error messages for missing/invalid variables
 * - Single source of truth for required env vars
 */
const envSchema = z.object({
  // WHY: NODE_ENV determines behavior (development, production, test)
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // WHY: PORT must be a valid number for Express server
  PORT: z.string().regex(/^\d+$/).transform(Number).default('3000'),
  
  // WHY: MONGODB_URI is required for database connection
  // Using string() with url() validation ensures it's a valid MongoDB connection string
  MONGODB_URI: z.string().url('MONGODB_URI must be a valid URL'),
  
  // WHY: CORS_ORIGIN allows frontend to make requests
  // Defaults to localhost:5173 (Vite default) for development
  CORS_ORIGIN: z.string().url().default('http://localhost:5173'),

  // WHY: JWT_SECRET is required for signing JWT tokens
  // Must be strong and kept secret - used to verify token authenticity
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),

  // WHY: JWT_REFRESH_SECRET is separate secret for refresh tokens
  // Separate secret provides additional security layer
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
});

/**
 * WHAT: Validated environment variables
 * 
 * WHY: This object provides type-safe access to environment variables
 * throughout the application. If validation fails, the app won't start,
 * preventing runtime errors.
 * 
 * HOW: Validates process.env against the schema and throws if invalid
 */
let env: z.infer<typeof envSchema>;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Invalid environment variables:');
    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
    process.exit(1);
  }
  throw error;
}

/**
 * WHAT: Exported validated environment variables
 * 
 * WHY: Single export point ensures all code uses validated env vars
 * TypeScript will enforce type safety based on the schema
 */
export default env;

