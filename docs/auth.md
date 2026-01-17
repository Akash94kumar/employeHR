# Authentication & Authorization Documentation

## Table of Contents

1. [Overview](#overview)
2. [What is Implemented](#what-is-implemented)
3. [Why JWT + Refresh Token Approach](#why-jwt--refresh-token-approach)
4. [How RBAC Works](#how-rbac-works)
5. [Request Lifecycle](#request-lifecycle)
6. [Security Considerations](#security-considerations)
7. [Trade-offs & Alternatives](#trade-offs--alternatives)

## Overview

### WHAT

Enterprise-grade authentication and authorization system for the HR & Employee Management Portal. Implements JWT-based authentication with refresh tokens and Role-Based Access Control (RBAC).

### WHY

A secure authentication system is the foundation of any enterprise application. This system provides:
- **Security**: Password hashing, token-based authentication, role-based access
- **Scalability**: Stateless JWT tokens work across multiple servers
- **User Experience**: Refresh tokens provide seamless authentication
- **Flexibility**: RBAC allows fine-grained permission control

### HOW

The system uses:
- **JWT Access Tokens**: Short-lived tokens for API access
- **Refresh Tokens**: Long-lived tokens for token renewal
- **Bcrypt**: Password hashing
- **MongoDB**: User storage and refresh token management
- **RBAC**: Role-based permission system

## What is Implemented

### Core Features

1. **User Registration**
   - Email and password validation
   - Password strength requirements
   - Role assignment (default: EMPLOYEE)
   - Password hashing with bcrypt

2. **User Login**
   - Email/password authentication
   - JWT access token generation
   - Refresh token generation
   - Token storage in database

3. **Token Management**
   - Access token (15 minutes expiration)
   - Refresh token (7 days expiration)
   - Token refresh endpoint
   - Token invalidation on logout

4. **Role-Based Access Control (RBAC)**
   - Four roles: SUPER_ADMIN, HR, MANAGER, EMPLOYEE
   - Role-based route protection
   - Middleware for role checking

5. **Protected Routes**
   - JWT verification middleware
   - User information attached to request
   - Automatic token validation

6. **Security Features**
   - Password hashing (bcrypt, 10 salt rounds)
   - Generic error messages (prevents email enumeration)
   - Token expiration
   - Refresh token rotation
   - Account activation status

### API Endpoints

#### Public Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh access token

#### Protected Endpoints

- `POST /api/auth/logout` - User logout (requires authentication)
- `GET /api/auth/me` - Get current user (requires authentication)

### User Model

```typescript
{
  email: string;           // Unique, indexed, lowercase
  password: string;        // Hashed with bcrypt
  role: UserRole;         // SUPER_ADMIN | HR | MANAGER | EMPLOYEE
  isActive: boolean;       // Soft delete flag
  refreshToken?: string;   // Stored refresh token
  createdAt: Date;        // Auto-generated
  updatedAt: Date;        // Auto-generated
}
```

### Roles & Permissions

| Role | Description | Typical Use Case |
|------|-------------|------------------|
| SUPER_ADMIN | Full system access | System administrators |
| HR | Human resources operations | HR department staff |
| MANAGER | Team management | Department managers |
| EMPLOYEE | Basic access | Regular employees |

## Why JWT + Refresh Token Approach

### Decision: JWT with Refresh Tokens

**Why JWT?**
1. **Stateless**: No server-side session storage required
2. **Scalable**: Works across multiple servers (microservices)
3. **Self-contained**: Token contains user information
4. **Standard**: Industry-standard authentication method

**Why Refresh Tokens?**
1. **Security**: Short-lived access tokens limit damage if compromised
2. **User Experience**: Long-lived refresh tokens provide seamless authentication
3. **Revocation**: Refresh tokens can be invalidated (stored in database)
4. **Rotation**: Can implement token rotation for enhanced security

### Token Strategy

**Access Token:**
- **Lifetime**: 15 minutes
- **Purpose**: API authentication
- **Storage**: Client-side (localStorage, memory, or httpOnly cookie)
- **Content**: User ID, email, role

**Refresh Token:**
- **Lifetime**: 7 days
- **Purpose**: Obtain new access tokens
- **Storage**: Database (for invalidation) + Client-side
- **Content**: User ID only

**Why This Strategy?**
- **Short access token**: If compromised, limited time window
- **Long refresh token**: Better UX, users don't need to login frequently
- **Database storage**: Allows invalidation and rotation
- **Separate secrets**: Additional security layer

### Alternative Approaches Considered

**1. Session-Based Authentication**
- **Pros**: Easy token revocation, server-side control
- **Cons**: Requires session storage, not scalable across servers
- **Decision**: Rejected for scalability reasons

**2. OAuth 2.0**
- **Pros**: Industry standard, supports third-party login
- **Cons**: More complex, overkill for internal system
- **Decision**: Can be added later if needed

**3. Long-Lived JWT Only**
- **Pros**: Simpler implementation
- **Cons**: Security risk if token compromised
- **Decision**: Rejected for security reasons

## How RBAC Works

### WHAT

Role-Based Access Control (RBAC) restricts access based on user roles. Different roles have different permissions.

### WHY

RBAC provides:
- **Security**: Users can only access resources they're authorized for
- **Flexibility**: Easy to add new roles or modify permissions
- **Maintainability**: Clear permission structure
- **Audit**: Easy to track who has access to what

### HOW

#### Role Hierarchy

```
SUPER_ADMIN (highest)
  ↓
HR
  ↓
MANAGER
  ↓
EMPLOYEE (lowest)
```

#### Middleware Usage

```typescript
// Require specific role
router.get('/admin/users', authenticate, requireRole(UserRole.SUPER_ADMIN), getUsersController);

// Require multiple roles (any of them)
router.get('/hr/reports', authenticate, requireRole(UserRole.HR, UserRole.SUPER_ADMIN), getReportsController);

// Convenience middleware
router.get('/employees', authenticate, requireEmployee(), getEmployeesController);
```

#### Permission Logic

- **SUPER_ADMIN**: Can access all routes
- **HR**: Can access HR routes and below
- **MANAGER**: Can access manager routes and below
- **EMPLOYEE**: Can only access employee routes

#### Implementation

1. **User has role** stored in database
2. **JWT token contains role** (included in access token)
3. **RBAC middleware checks role** against allowed roles
4. **403 Forbidden** if role not allowed

## Request Lifecycle

### Login Flow

```
1. Client sends POST /api/auth/login
   {
     "email": "user@example.com",
     "password": "password123"
   }

2. Validation middleware validates request body

3. Auth controller calls auth service

4. Auth service:
   - Finds user by email
   - Compares password with bcrypt
   - Checks if user is active
   - Generates access token (JWT)
   - Generates refresh token (JWT)
   - Stores refresh token in database
   - Returns tokens and user info

5. Controller returns response:
   {
     "success": true,
     "data": {
       "accessToken": "eyJhbGc...",
       "refreshToken": "eyJhbGc...",
       "user": {
         "id": "...",
         "email": "user@example.com",
         "role": "EMPLOYEE"
       }
     }
   }
```

### Protected Route Access Flow

```
1. Client sends request with Authorization header:
   Authorization: Bearer <access_token>

2. Auth middleware:
   - Extracts token from header
   - Verifies token signature with JWT_SECRET
   - Checks token expiration
   - Decodes token to get user payload
   - Attaches user to request (req.user)

3. RBAC middleware (if present):
   - Checks req.user.role
   - Compares with allowed roles
   - Returns 403 if not allowed

4. Controller:
   - Uses req.user for user information
   - Processes request
   - Returns response
```

### Token Refresh Flow

```
1. Client sends POST /api/auth/refresh
   {
     "refreshToken": "eyJhbGc..."
   }

2. Auth service:
   - Verifies refresh token with JWT_REFRESH_SECRET
   - Checks if token matches stored token in database
   - Verifies user is active
   - Generates new access token
   - Returns new access token

3. Client receives new access token
   - Uses new token for subsequent requests
```

### Logout Flow

```
1. Client sends POST /api/auth/logout
   Authorization: Bearer <access_token>

2. Auth middleware verifies token

3. Auth service:
   - Removes refresh token from database
   - Token is now invalid

4. Client should discard tokens
```

## Security Considerations

### Password Security

**Hashing:**
- **Algorithm**: bcrypt
- **Salt Rounds**: 10 (good balance of security and performance)
- **Why**: bcrypt is designed for password hashing, includes salt automatically

**Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Token Security

**Access Token:**
- **Short expiration**: 15 minutes limits damage if compromised
- **HTTP-only cookies**: Consider for XSS protection (not implemented yet)
- **HTTPS only**: In production, enforce HTTPS

**Refresh Token:**
- **Long expiration**: 7 days for UX
- **Database storage**: Allows invalidation
- **Separate secret**: Additional security layer
- **Rotation**: Can implement token rotation (not implemented yet)

### Error Messages

**Generic Messages:**
- "Invalid email or password" (prevents email enumeration)
- "Unauthorized" (doesn't reveal why)
- "Insufficient permissions" (doesn't reveal what's needed)

**Why**: Prevents information leakage to attackers

### Best Practices

1. **Never return passwords**: Always exclude from responses
2. **HTTPS in production**: Encrypts tokens in transit
3. **Token storage**: Consider httpOnly cookies for XSS protection
4. **Rate limiting**: Implement rate limiting (structure ready, not implemented)
5. **Token rotation**: Consider implementing refresh token rotation
6. **Audit logging**: Log authentication events for security monitoring

### Rate Limiting (Structure Ready)

**Why**: Prevents brute force attacks

**Structure**: Ready for implementation
```typescript
// Can add rate limiting middleware
import rateLimit from 'express-rate-limit';

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, please try again later',
});
```

## Trade-offs & Alternatives

### JWT vs Sessions

**JWT (Chosen):**
- ✅ Stateless (scalable)
- ✅ Works across servers
- ✅ Self-contained
- ❌ Harder to revoke (need refresh token strategy)
- ❌ Larger token size

**Sessions:**
- ✅ Easy revocation
- ✅ Server-side control
- ❌ Requires session storage
- ❌ Not scalable across servers
- ❌ Requires sticky sessions or shared storage

**Decision**: JWT chosen for scalability

### Refresh Token Storage

**Database Storage (Chosen):**
- ✅ Can invalidate tokens
- ✅ Can detect token theft
- ✅ Can implement rotation
- ❌ Database query on each refresh

**In-Memory Storage:**
- ✅ Faster (no database query)
- ❌ Can't invalidate easily
- ❌ Lost on server restart
- ❌ Doesn't work across servers

**Decision**: Database storage chosen for security and flexibility

### Password Hashing

**bcrypt (Chosen):**
- ✅ Designed for passwords
- ✅ Adaptive (can increase rounds)
- ✅ Includes salt automatically
- ❌ Slower (by design)

**Argon2:**
- ✅ More modern
- ✅ Better security
- ❌ Less widely used
- ❌ More complex

**Decision**: bcrypt chosen for maturity and simplicity

### OAuth 2.0

**Current Implementation:**
- Basic email/password authentication
- JWT tokens
- Refresh tokens

**OAuth 2.0 (Future Consideration):**
- Third-party login (Google, Microsoft, etc.)
- More complex
- Industry standard for external auth

**Decision**: Can add OAuth 2.0 later if needed

## API Examples

### Login

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "role": "EMPLOYEE"
    }
  }
}
```

### Get Current User

**Request:**
```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "role": "EMPLOYEE",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Refresh Token

**Request:**
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Logout

**Request:**
```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

## Environment Variables

Add to `.env` file:

```env
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_REFRESH_SECRET=your-super-secret-refresh-key-at-least-32-characters-long
```

**Why**: Separate secrets for access and refresh tokens provide additional security.

## Testing

### Manual Testing

1. **Register User:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Password123!","role":"EMPLOYEE"}'
   ```

2. **Login:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Password123!"}'
   ```

3. **Get Current User:**
   ```bash
   curl -X GET http://localhost:3000/api/auth/me \
     -H "Authorization: Bearer <access_token>"
   ```

## Summary

### Key Features

✅ JWT-based authentication  
✅ Refresh token strategy  
✅ Password hashing with bcrypt  
✅ Role-Based Access Control (RBAC)  
✅ Protected routes middleware  
✅ Token invalidation on logout  
✅ Generic error messages  
✅ Request validation  

### Security Measures

✅ Password hashing (bcrypt, 10 rounds)  
✅ Short-lived access tokens (15 minutes)  
✅ Long-lived refresh tokens (7 days)  
✅ Token storage in database  
✅ Generic error messages  
✅ Account activation status  
✅ Role-based access control  

### Next Steps

1. Add rate limiting
2. Implement token rotation
3. Add OAuth 2.0 (if needed)
4. Add audit logging
5. Add password reset functionality
6. Add email verification

---

**Last Updated**: Initial implementation  
**Maintained By**: Backend Security Team

