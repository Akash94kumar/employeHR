import { registerAs } from '@nestjs/config';

/**
 * WHAT: JWT configuration factory
 * 
 * WHY: Centralizes JWT configuration
 * Makes it easy to manage token expiration and secrets
 * 
 * HOW: Uses registerAs to create a namespaced configuration
 */
export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  refreshSecret:
    process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
}));

