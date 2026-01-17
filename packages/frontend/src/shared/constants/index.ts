/**
 * WHAT: Shared constants used across the application
 * 
 * WHY: Centralized constants ensure consistency and make updates easier
 * Magic numbers and strings should be defined here, not scattered in code
 * 
 * HOW: Export constants that are used by multiple features
 */

// WHY: API endpoints should be centralized for easy updates
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
  },
} as const;

// WHY: Route paths should be centralized for consistency
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
} as const;

// WHY: Local storage keys should be centralized to avoid typos
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
} as const;

// WHY: Pagination defaults ensure consistency across list views
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

