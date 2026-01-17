import { Response, NextFunction } from 'express';
import { UserRole } from '../modules/auth/auth.types';
import { AuthenticatedRequest } from './auth.middleware';
import { AUTH_ERRORS } from '../modules/auth/auth.constants';

/**
 * WHAT: Role-Based Access Control (RBAC) middleware
 * 
 * WHY: RBAC restricts access based on user roles.
 * Different roles have different permissions:
 * - SUPER_ADMIN: Full access
 * - HR: HR operations
 * - MANAGER: Team management
 * - EMPLOYEE: Basic access
 * 
 * HOW: Checks user role against allowed roles, returns 403 if not allowed
 */

/**
 * WHAT: RBAC middleware factory
 * 
 * WHY: Factory pattern allows creating middleware for different role requirements.
 * Each route can specify which roles are allowed.
 * 
 * HOW: Returns Express middleware that checks user role
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    // WHY: Check if user is authenticated (should be called after authenticate middleware)
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          message: AUTH_ERRORS.UNAUTHORIZED,
        },
      });
      return;
    }

    // WHY: Check if user's role is in allowed roles
    // If not, return 403 Forbidden
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: {
          message: AUTH_ERRORS.FORBIDDEN,
        },
      });
      return;
    }

    // WHY: User has required role, continue to next middleware/controller
    next();
  };
}

/**
 * WHAT: Convenience middleware for specific roles
 * 
 * WHY: Pre-defined middleware for common role checks.
 * Makes routes more readable: requireSuperAdmin() vs requireRole(UserRole.SUPER_ADMIN)
 * 
 * HOW: Wraps requireRole with specific role
 */
export const requireSuperAdmin = () => requireRole(UserRole.SUPER_ADMIN);
export const requireHR = () => requireRole(UserRole.HR, UserRole.SUPER_ADMIN);
export const requireManager = () =>
  requireRole(UserRole.MANAGER, UserRole.HR, UserRole.SUPER_ADMIN);
export const requireEmployee = () =>
  requireRole(
    UserRole.EMPLOYEE,
    UserRole.MANAGER,
    UserRole.HR,
    UserRole.SUPER_ADMIN,
  );

