import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks';

/**
 * WHAT: Protected route component
 * 
 * WHY: Route-level authentication check prevents unauthorized access.
 * Even though backend enforces auth, frontend check provides:
 * - Better UX (immediate redirect, no API call)
 * - Reduced server load (no unnecessary requests)
 * - Client-side route protection
 * 
 * HOW: Checks auth state, redirects to login if not authenticated
 */

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * WHAT: Protected route wrapper component
 * 
 * WHY: Wraps routes that require authentication.
 * Automatically redirects unauthenticated users to login.
 * 
 * HOW: Checks isAuthenticated, renders children or redirects
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  // WHY: Show loading state while checking authentication
  // Prevents flash of login page for authenticated users
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
  // Preserves intended destination for redirect after login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // WHY: Render protected content if authenticated
  return <>{children}</>;
}

