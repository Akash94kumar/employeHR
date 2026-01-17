import { Request, Response, NextFunction } from 'express';
import {
  loginUser,
  registerUser,
  refreshAccessToken,
  logoutUser,
  getUserById,
} from './auth.service';
import { LoginInput, RegisterInput, RefreshTokenInput } from './auth.validation';
import { AUTH_ERRORS } from './auth.constants';
import { sendSuccess } from '../../utils/response.util';

/**
 * WHAT: Authentication controller - HTTP request/response layer
 * 
 * WHY: Controller layer handles HTTP-specific concerns:
 * - Request/response formatting
 * - HTTP status codes
 * - Error handling and transformation
 * - Input validation (delegates to validation layer)
 * 
 * HOW: Express route handlers that call service layer and format responses
 */

/**
 * WHAT: Login controller
 * 
 * WHY: Handles POST /api/auth/login requests.
 * Validates input, calls service, returns tokens and user info.
 * 
 * HOW: Express route handler
 */
export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // WHY: Request body is validated by validation middleware before reaching controller
    // Type assertion is safe because validation ensures correct structure
    const input = req.body as LoginInput;

    // WHY: Call service layer for business logic
    // Controller only handles HTTP concerns, not business logic
    const result = await loginUser(input);

    // WHY: Use standardized success response utility
    // Returns consistent format: { success: true, data: {...} }
    sendSuccess(res, result, 200);
  } catch (error) {
    // WHY: Pass error to error middleware for consistent error handling
    // Error middleware formats error response
    next(error);
  }
}

/**
 * WHAT: Register controller
 * 
 * WHY: Handles user registration requests.
 * In HR systems, typically only admins create users, but endpoint exists for flexibility.
 * 
 * HOW: Express route handler
 */
export async function registerController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = req.body as RegisterInput;

    // WHY: Call service to create user
    const user = await registerUser(input);

    // WHY: Use standardized success response utility
    // 201 Created for resource creation
    sendSuccess(
      res,
      {
        message: 'User created successfully',
        user,
      },
      201,
    );
  } catch (error) {
    next(error);
  }
}

/**
 * WHAT: Refresh token controller
 * 
 * WHY: Handles token refresh requests.
 * Allows getting new access token without re-authentication.
 * 
 * HOW: Express route handler
 */
export async function refreshTokenController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = req.body as RefreshTokenInput;

    // WHY: Call service to refresh access token
    const result = await refreshAccessToken(input);

    // WHY: Use standardized success response utility
    sendSuccess(res, result, 200);
  } catch (error) {
    next(error);
  }
}

/**
 * WHAT: Logout controller
 * 
 * WHY: Handles logout requests.
 * Invalidates refresh token to prevent token reuse.
 * 
 * HOW: Express route handler
 */
export async function logoutController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // WHY: Get userId from request (set by auth middleware)
    // req.user is added by auth middleware after JWT verification
    const userId = (req as any).user?.userId;

    if (!userId) {
      throw new Error(AUTH_ERRORS.UNAUTHORIZED);
    }

    // WHY: Call service to invalidate refresh token
    await logoutUser(userId);

    // WHY: Use standardized success response utility
    sendSuccess(
      res,
      {
        message: 'Logged out successfully',
      },
      200,
    );
  } catch (error) {
    next(error);
  }
}

/**
 * WHAT: Get current user controller
 * 
 * WHY: Handles GET /api/auth/me requests.
 * Returns current authenticated user information.
 * 
 * HOW: Express route handler
 */
export async function getCurrentUserController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // WHY: Get userId from request (set by auth middleware)
    const userId = (req as any).user?.userId;

    if (!userId) {
      throw new Error(AUTH_ERRORS.UNAUTHORIZED);
    }

    // WHY: Get user information from service
    const user = await getUserById(userId);

    // WHY: Use standardized success response utility
    sendSuccess(res, { user }, 200);
  } catch (error) {
    next(error);
  }
}

