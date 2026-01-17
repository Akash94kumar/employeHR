import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks';
import { UserRole } from '@/features/auth/types';

/**
 * WHAT: Role-based route guard component
 * 
 * WHY: Route-level authorization check ensures users can only access routes
 * appropriate for their role. Even though backend enforces RBAC, frontend
 * check provides:
 * - Better UX (immediate feedback, no API call)
 * - Reduced server load
 * - Client-side authorization
 * - Prevents unauthorized route access
 * 
 * HOW: Checks user role, renders children or redirects based on role
 */

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
}

/**
 * WHAT: Role guard wrapper component
 * 
 * WHY: Wraps routes that require specific roles.
 * Automatically redirects users without required roles.
 * 
 * HOW: Checks user role against allowed roles, renders or redirects
 */
export function RoleGuard({
  children,
  allowedRoles,
  fallbackPath = '/',
}: RoleGuardProps) {
  const { user, isAuthenticated, loading } = useAuth();

  // WHY: Show loading while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" role="status" aria-label="Loading">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  // WHY: Redirect to login if not authenticated
  // Must be authenticated before checking role
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // WHY: Check if user role is in allowed roles
  // If not, redirect to fallback path (default: home)
  if (!allowedRoles.includes(user.role)) {
    // WHY: Redirect based on user's actual role
    // Users should land on their appropriate dashboard
    switch (user.role) {
      case UserRole.SUPER_ADMIN:
        return <Navigate to="/admin" replace />;
      case UserRole.HR:
        return <Navigate to="/hr" replace />;
      case UserRole.EMPLOYEE:
        return <Navigate to="/employee" replace />;
      default:
        return <Navigate to={fallbackPath} replace />;
    }
  }

  // WHY: Render content if user has required role
  return <>{children}</>;
}

