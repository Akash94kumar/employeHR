import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../modules/auth/auth.types';
import { AUTH_ERRORS } from '../modules/auth/auth.constants';
import env from '../config/env';

/**
 * WHAT: JWT authentication middleware
 * 
 * WHY: Middleware verifies JWT token and attaches user info to request.
 * Protects routes by ensuring only authenticated users can access.
 * 
 * HOW: Verifies JWT token from Authorization header, adds user to request
 */

/**
 * WHAT: Extended Request interface with user property
 * 
 * WHY: TypeScript interface extends Express Request to include user.
 * Provides type safety when accessing req.user in controllers.
 * 
 * HOW: Extends Request interface
 */
export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

/**
 * WHAT: JWT authentication middleware
 * 
 * WHY: Verifies JWT access token from Authorization header.
 * If valid, attaches user payload to request for use in controllers.
 * If invalid, returns 401 Unauthorized.
 * 
 * HOW: Extracts token from header, verifies with JWT, attaches to request
 */
export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  try {
    // WHY: Extract token from Authorization header
    // Format: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: {
          message: AUTH_ERRORS.UNAUTHORIZED,
        },
      });
      return;
    }

    // WHY: Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    // WHY: Verify token signature and expiration
    // jwt.verify throws error if token is invalid or expired
    const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;

    // WHY: Attach user payload to request
    // Controllers can access req.user for user information
    req.user = decoded;

    // WHY: Continue to next middleware/controller
    next();
  } catch (error) {
    // WHY: Handle JWT errors (expired, invalid signature, etc.)
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: {
          message: AUTH_ERRORS.TOKEN_INVALID,
        },
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: {
          message: AUTH_ERRORS.TOKEN_EXPIRED,
        },
      });
      return;
    }

    // WHY: Pass other errors to error middleware
    next(error);
  }
}

