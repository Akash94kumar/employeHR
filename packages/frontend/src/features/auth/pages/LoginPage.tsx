import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { useAuth } from '../hooks';
import { UserRole } from '../types';

/**
 * WHAT: Login page component
 * 
 * WHY: Login page wrapper that handles authenticated user redirection.
 * If user is already logged in, redirects to appropriate dashboard.
 * 
 * HOW: Checks auth state, renders login form or redirects
 */
export default function LoginPage() {
  const { isAuthenticated, user } = useAuth();

  // WHY: Redirect authenticated users to their dashboard
  // Prevents logged-in users from seeing login page
  useEffect(() => {
    if (isAuthenticated && user) {
      // WHY: Role-based redirection ensures users land on correct dashboard
      switch (user.role) {
        case UserRole.SUPER_ADMIN:
          return <Navigate to="/admin" replace />;
        case UserRole.HR:
          return <Navigate to="/hr" replace />;
        case UserRole.EMPLOYEE:
          return <Navigate to="/employee" replace />;
      }
    }
  }, [isAuthenticated, user]);

  // WHY: If already authenticated, redirect immediately
  if (isAuthenticated && user) {
    switch (user.role) {
      case UserRole.SUPER_ADMIN:
        return <Navigate to="/admin" replace />;
      case UserRole.HR:
        return <Navigate to="/hr" replace />;
      case UserRole.EMPLOYEE:
        return <Navigate to="/employee" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // WHY: Render login form for unauthenticated users
  return <LoginForm />;
}
