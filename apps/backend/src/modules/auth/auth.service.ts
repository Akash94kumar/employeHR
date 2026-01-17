import jwt from 'jsonwebtoken';
import { User, IUserDocument } from './auth.model';
import { LoginInput, RegisterInput, RefreshTokenInput } from './auth.validation';
import {
  LoginResponse,
  JWTPayload,
  UserRole,
  IUser,
} from './auth.types';
import { AUTH_ERRORS } from './auth.constants';
import { TOKEN_EXPIRATION } from './auth.constants';
import env from '../../config/env';

/**
 * WHAT: Authentication service - business logic layer
 * 
 * WHY: Service layer separates business logic from HTTP layer (controller).
 * This provides:
 * - Reusability (logic can be used by controllers, other services, etc.)
 * - Testability (can test business logic without HTTP)
 * - Single Responsibility (controller handles HTTP, service handles logic)
 * 
 * HOW: Contains all authentication business logic: login, register, token generation
 */

/**
 * WHAT: Generate JWT access token
 * 
 * WHY: Access tokens are short-lived JWTs that contain user identity.
 * Short expiration (15 minutes) limits damage if token is compromised.
 * 
 * HOW: Signs JWT with user payload and secret
 */
function generateAccessToken(payload: JWTPayload): string {
  // WHY: Sign JWT with user payload, secret, and expiration
  // Access token contains userId, email, and role for authorization
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRATION.ACCESS_TOKEN,
  });
}

/**
 * WHAT: Generate JWT refresh token
 * 
 * WHY: Refresh tokens are long-lived tokens used to get new access tokens.
 * Stored in database for invalidation and rotation.
 * Separate secret provides additional security.
 * 
 * HOW: Signs JWT with user ID and refresh secret
 */
function generateRefreshToken(userId: string): string {
  // WHY: Refresh token only contains userId (minimal payload)
  // Long expiration (7 days) for better UX
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: TOKEN_EXPIRATION.REFRESH_TOKEN,
  });
}

/**
 * WHAT: User registration service
 * 
 * WHY: Registration creates new user accounts.
 * In HR systems, typically only admins create users, but service supports both.
 * 
 * HOW: Creates user with hashed password and default role
 */
export async function registerUser(
  input: RegisterInput,
): Promise<Omit<IUser, 'password' | 'refreshToken'>> {
  // WHY: Check if user already exists - prevents duplicate accounts
  const existingUser = await User.findOne({ email: input.email });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // WHY: Create user with hashed password (hashing happens in pre-save hook)
  const user = await User.create({
    email: input.email,
    password: input.password, // WHY: Password will be hashed by pre-save hook
    role: input.role || UserRole.EMPLOYEE,
    isActive: true,
  });

  // WHY: Return user without password and refreshToken (security)
  const userObject = user.toObject();
  delete (userObject as any).password;
  delete (userObject as any).refreshToken;

  return userObject as Omit<IUser, 'password' | 'refreshToken'>;
}

/**
 * WHAT: User login service
 * 
 * WHY: Login authenticates user and returns tokens.
 * Validates credentials, checks if user is active, generates tokens.
 * 
 * HOW: Finds user, verifies password, generates tokens, stores refresh token
 */
export async function loginUser(
  input: LoginInput,
): Promise<LoginResponse> {
  // WHY: Find user by email with password selected (normally password is excluded)
  // select('+password') explicitly includes password field for comparison
  const user = await User.findOne({ email: input.email }).select('+password');

  // WHY: Generic error message prevents email enumeration attacks
  // Attacker can't tell if email exists or password is wrong
  if (!user) {
    throw new Error(AUTH_ERRORS.INVALID_CREDENTIALS);
  }

  // WHY: Check if account is active - allows soft delete without data loss
  if (!user.isActive) {
    throw new Error(AUTH_ERRORS.USER_INACTIVE);
  }

  // WHY: Compare provided password with stored hash
  // comparePassword is instance method defined in model
  const isPasswordValid = await user.comparePassword(input.password);
  if (!isPasswordValid) {
    throw new Error(AUTH_ERRORS.INVALID_CREDENTIALS);
  }

  // WHY: Generate tokens after successful authentication
  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(user._id.toString());

  // WHY: Store refresh token in database for:
  // - Token invalidation on logout
  // - Token rotation (can revoke old tokens)
  // - Security (can detect token theft if multiple refresh tokens exist)
  user.refreshToken = refreshToken;
  await user.save();

  // WHY: Return tokens and user info (without sensitive data)
  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    },
  };
}

/**
 * WHAT: Refresh access token service
 * 
 * WHY: Refresh tokens allow getting new access tokens without re-authentication.
 * Improves UX (users don't need to login frequently) while maintaining security.
 * 
 * HOW: Verifies refresh token, generates new access token
 */
export async function refreshAccessToken(
  input: RefreshTokenInput,
): Promise<{ accessToken: string }> {
  try {
    // WHY: Verify refresh token signature and expiration
    // If invalid or expired, throw error
    const decoded = jwt.verify(
      input.refreshToken,
      env.JWT_REFRESH_SECRET,
    ) as { userId: string };

    // WHY: Find user and verify refresh token matches stored token
    // This prevents use of revoked tokens
    const user = await User.findById(decoded.userId).select('+refreshToken');
    if (!user || !user.isActive) {
      throw new Error(AUTH_ERRORS.USER_INACTIVE);
    }

    // WHY: Verify refresh token matches stored token
    // Prevents use of old/revoked tokens
    if (user.refreshToken !== input.refreshToken) {
      throw new Error(AUTH_ERRORS.REFRESH_TOKEN_INVALID);
    }

    // WHY: Generate new access token with current user data
    const payload: JWTPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);

    return { accessToken };
  } catch (error) {
    // WHY: Handle JWT errors (expired, invalid signature, etc.)
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error(AUTH_ERRORS.REFRESH_TOKEN_INVALID);
    }
    throw error;
  }
}

/**
 * WHAT: Logout service
 * 
 * WHY: Logout invalidates refresh token by removing it from database.
 * Prevents token reuse after logout.
 * 
 * HOW: Removes refresh token from user document
 */
export async function logoutUser(userId: string): Promise<void> {
  // WHY: Remove refresh token from database
  // After logout, refresh token can't be used to get new access tokens
  await User.findByIdAndUpdate(userId, {
    $unset: { refreshToken: 1 }, // WHY: $unset removes field from document
  });
}

/**
 * WHAT: Get user by ID service
 * 
 * WHY: Retrieves user information for authenticated requests.
 * Used by protected routes to get current user.
 * 
 * HOW: Finds user by ID, excludes sensitive fields
 */
export async function getUserById(
  userId: string,
): Promise<Omit<IUser, 'password' | 'refreshToken'>> {
  const user = await User.findById(userId);
  if (!user || !user.isActive) {
    throw new Error('User not found');
  }

  // WHY: Return user without sensitive fields
  const userObject = user.toObject();
  delete (userObject as any).password;
  delete (userObject as any).refreshToken;

  return userObject as Omit<IUser, 'password' | 'refreshToken'>;
}

