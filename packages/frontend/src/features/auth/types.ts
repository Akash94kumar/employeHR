/**
 * WHAT: Authentication types and interfaces for frontend
 *
 * WHY: Centralized type definitions ensure type safety across auth feature.
 * Types match backend API responses and Redux state structure.
 *
 * HOW: Exports interfaces and types used in auth slice, service, and components
 */

/**
 * WHAT: User roles enum matching backend
 *
 * WHY: Enum ensures type safety and prevents typos.
 * Must match backend UserRole enum exactly.
 *
 * HOW: Used in auth state, route guards, and role-based UI
 */
export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  HR = "HR",
  MANAGER = "MANAGER",
  EMPLOYEE = "EMPLOYEE",
}

/**
 * WHAT: User interface from backend
 *
 * WHY: Type-safe representation of user data from API.
 * Ensures frontend and backend data structures match.
 *
 * HOW: Used in auth state and components
 */
export interface User {
  id: string;
  email: string;
  role: UserRole;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * WHAT: Login request payload
 *
 * WHY: Type-safe login form data.
 * Ensures correct data structure sent to backend.
 *
 * HOW: Used in login form and auth service
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * WHAT: Login response from backend
 *
 * WHY: Type-safe API response structure.
 * Matches backend LoginResponse interface.
 *
 * HOW: Used in auth service and Redux slice
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

/**
 * WHAT: Auth state interface for Redux
 *
 * WHY: Defines structure of authentication state in Redux store.
 * Ensures consistent state shape across application.
 *
 * HOW: Used in auth slice and selectors
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * WHAT: Refresh token response
 *
 * WHY: Type-safe refresh token API response.
 * Used when refreshing access token.
 *
 * HOW: Used in auth service
 */
export interface RefreshTokenResponse {
  accessToken: string;
}
