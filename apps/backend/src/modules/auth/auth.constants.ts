/**
 * WHAT: Authentication constants and configuration
 * 
 * WHY: Centralized constants provide:
 * - Single place to modify auth configuration
 * - Easy to update token expiration times
 * - Consistent error messages
 * - Better maintainability
 * 
 * HOW: Exports constants used across auth module
 */

/**
 * WHAT: JWT token expiration times
 * 
 * WHY: Different expiration times for access and refresh tokens:
 * - Access token: Short-lived (15 minutes) - if compromised, limited damage
 * - Refresh token: Long-lived (7 days) - allows seamless user experience
 * 
 * Trade-off: Shorter access token = more secure but more refresh calls
 * Longer refresh token = better UX but more risk if compromised
 * 
 * HOW: Used in auth service when generating tokens
 */
export const TOKEN_EXPIRATION = {
  ACCESS_TOKEN: '15m', // 15 minutes - short-lived for security
  REFRESH_TOKEN: '7d', // 7 days - long-lived for UX
} as const;

/**
 * WHAT: Password requirements
 * 
 * WHY: Strong passwords prevent brute force attacks.
 * Minimum requirements ensure basic security.
 * 
 * HOW: Used in password validation
 */
export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBER: true,
  REQUIRE_SPECIAL_CHAR: true,
} as const;

/**
 * WHAT: Authentication error messages
 * 
 * WHY: Generic error messages prevent information leakage.
 * Attackers can't determine if email exists or password is wrong.
 * 
 * HOW: Used in auth service and controller
 */
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'Invalid email or password', // Generic message for security
  USER_INACTIVE: 'Account is inactive. Please contact administrator',
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_INVALID: 'Invalid token',
  REFRESH_TOKEN_INVALID: 'Invalid refresh token',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Insufficient permissions',
} as const;

/**
 * WHAT: Bcrypt salt rounds
 * 
 * WHY: Salt rounds determine password hashing complexity.
 * Higher rounds = more secure but slower.
 * 10 rounds is a good balance (recommended by bcrypt).
 * 
 * HOW: Used in password hashing
 */
export const BCRYPT_SALT_ROUNDS = 10;

