/**
 * WHAT: TypeScript types, interfaces, and enums for authentication module
 *
 * WHY: Centralized type definitions provide:
 * - Type safety across the auth module
 * - Single source of truth for roles and permissions
 * - Better IDE autocomplete and error detection
 * - Self-documenting code through types
 *
 * HOW: Exports enums, interfaces, and type aliases used throughout auth module
 */

/**
 * WHAT: User roles enum for Role-Based Access Control (RBAC)
 *
 * WHY: Enum ensures type safety and prevents typos when checking roles.
 * RBAC allows different permission levels:
 * - SUPER_ADMIN: Full system access, can manage all users
 * - HR: Human resources operations, employee management
 * - MANAGER: Team management, can view/manage their team
 * - EMPLOYEE: Basic access, can view own data
 *
 * HOW: Used in user model, middleware, and service layer
 */
export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  HR = "HR",
  MANAGER = "MANAGER",
  EMPLOYEE = "EMPLOYEE",
}

/**
 * WHAT: JWT payload interface
 *
 * WHY: Type-safe JWT payload ensures consistent token structure.
 * Contains user identity and role for authorization decisions.
 *
 * HOW: Used when creating and verifying JWT tokens
 */
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

/**
 * WHAT: Login request interface
 *
 * WHY: Type-safe request body for login endpoint.
 * Ensures email and password are present and typed correctly.
 *
 * HOW: Used in auth controller and validation
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * WHAT: Login response interface
 *
 * WHY: Consistent response structure for login endpoint.
 * Returns access token for immediate use and refresh token for token renewal.
 *
 * HOW: Used in auth controller to structure login response
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}

/**
 * WHAT: Refresh token request interface
 *
 * WHY: Type-safe request body for refresh token endpoint.
 * Contains refresh token for generating new access token.
 *
 * HOW: Used in auth controller and validation
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * WHAT: User document interface (MongoDB document)
 *
 * WHY: Type-safe representation of user document from database.
 * Extends Mongoose Document for type safety.
 *
 * HOW: Used in auth service and model
 */
export interface IUser {
  _id: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}
