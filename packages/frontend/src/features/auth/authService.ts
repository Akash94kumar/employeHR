import apiClient from '@/shared/utils/api';
import { LoginRequest, LoginResponse, RefreshTokenResponse, User } from './types';

/**
 * WHAT: Authentication service - API calls for authentication
 * 
 * WHY: Service layer separates API logic from components and Redux.
 * Provides:
 * - Reusable API calls
 * - Centralized error handling
 * - Type-safe API interactions
 * - Easy to mock for testing
 * 
 * HOW: Uses axios instance (apiClient) for HTTP requests
 */

/**
 * WHAT: Login API call
 * 
 * WHY: Authenticates user with email and password.
 * Returns tokens and user information for Redux state.
 * 
 * HOW: POST request to /api/auth/login
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<{ success: boolean; data: LoginResponse }>(
    '/auth/login',
    credentials,
  );
  return response.data.data;
}

/**
 * WHAT: Get current user API call
 * 
 * WHY: Retrieves current authenticated user information.
 * Used to restore auth state on app reload.
 * 
 * HOW: GET request to /api/auth/me (requires authentication)
 */
export async function getCurrentUser(): Promise<{ success: boolean; data: { user: User } }> {
  const response = await apiClient.get<{ success: boolean; data: { user: User } }>(
    '/auth/me',
  );
  return response.data;
}

/**
 * WHAT: Refresh access token API call
 * 
 * WHY: Gets new access token using refresh token.
 * Refresh token is stored in httpOnly cookie or secure storage (not Redux).
 * 
 * HOW: POST request to /api/auth/refresh
 */
export async function refreshAccessToken(
  refreshToken: string,
): Promise<RefreshTokenResponse> {
  const response = await apiClient.post<{ success: boolean; data: RefreshTokenResponse }>(
    '/auth/refresh',
    { refreshToken },
  );
  return response.data.data;
}

/**
 * WHAT: Logout API call
 * 
 * WHY: Invalidates refresh token on backend.
 * Clears server-side session.
 * 
 * HOW: POST request to /api/auth/logout (requires authentication)
 */
export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}

