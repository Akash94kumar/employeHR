import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { RootState } from '@/app/store';
import { loginUser, logoutUser, getCurrentUser, clearError } from './authSlice';
import { LoginRequest, UserRole } from './types';

/**
 * WHAT: Custom hooks for authentication
 * 
 * WHY: Custom hooks provide:
 * - Clean component API
 * - Encapsulated Redux logic
 * - Reusable authentication logic
 * - Type-safe hooks
 * 
 * HOW: Wraps Redux hooks and provides auth-specific functionality
 */

/**
 * WHAT: Hook to access authentication state
 * 
 * WHY: Provides type-safe access to auth state.
 * Components don't need to know Redux structure.
 * 
 * HOW: Uses useSelector with typed RootState
 */
export function useAuth() {
  return useSelector((state: RootState) => state.auth);
}

/**
 * WHAT: Hook for authentication actions
 * 
 * WHY: Provides typed dispatch functions for auth operations.
 * Encapsulates Redux dispatch logic.
 * 
 * HOW: Returns object with auth action functions
 */
export function useAuthActions() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // WHY: useCallback prevents function recreation on every render
  // This prevents unnecessary re-renders and API calls
  const handleGetCurrentUser = useCallback(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  const handleLogin = useCallback(
    async (credentials: LoginRequest) => {
      const result = await dispatch(loginUser(credentials));
      
      // WHY: Navigate based on role after successful login
      // Different roles have different dashboards
      if (loginUser.fulfilled.match(result)) {
        const role = result.payload.user.role;
        
        // WHY: Role-based routing ensures users land on correct dashboard
        switch (role) {
          case UserRole.SUPER_ADMIN:
            navigate('/admin');
            break;
          case UserRole.HR:
            navigate('/hr');
            break;
          case UserRole.EMPLOYEE:
          case UserRole.MANAGER:
            navigate('/employee');
            break;
          default:
            navigate('/dashboard');
        }
      }
    },
    [dispatch, navigate],
  );

  const handleLogout = useCallback(async () => {
    await dispatch(logoutUser());
    navigate('/login');
  }, [dispatch, navigate]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    /**
     * WHAT: Login function
     * 
     * WHY: Handles login flow with automatic role-based redirection.
     * Dispatches login thunk and navigates based on user role.
     * 
     * HOW: Calls loginUser thunk, then navigates based on role
     */
    login: handleLogin,

    /**
     * WHAT: Logout function
     * 
     * WHY: Handles logout flow with navigation.
     * Clears auth state and redirects to login.
     * 
     * HOW: Calls logoutUser thunk, then navigates to login
     */
    logout: handleLogout,

    /**
     * WHAT: Get current user function
     * 
     * WHY: Restores auth state on app reload.
     * Checks if user is still authenticated.
     * 
     * HOW: Calls getCurrentUser thunk
     * 
     * NOTE: Memoized with useCallback to prevent multiple calls
     */
    getCurrentUser: handleGetCurrentUser,

    /**
     * WHAT: Clear error function
     * 
     * WHY: Allows dismissing error messages.
     * Useful for user-initiated error clearing.
     * 
     * HOW: Dispatches clearError action
     */
    clearError: handleClearError,
  };
}

/**
 * WHAT: Hook to check if user has specific role
 * 
 * WHY: Provides convenient role checking in components.
 * Used for conditional rendering and route guards.
 * 
 * HOW: Checks user role from auth state
 */
export function useHasRole(role: UserRole): boolean {
  const { user } = useAuth();
  return user?.role === role;
}

/**
 * WHAT: Hook to check if user has any of the specified roles
 * 
 * WHY: Allows checking multiple roles at once.
 * Useful for components accessible to multiple roles.
 * 
 * HOW: Checks if user role is in provided array
 */
export function useHasAnyRole(roles: UserRole[]): boolean {
  const { user } = useAuth();
  return user ? roles.includes(user.role) : false;
}

