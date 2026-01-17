# Frontend Authentication Documentation

## Table of Contents

1. [Overview](#overview)
2. [What is Implemented](#what-is-implemented)
3. [Role-Based Routing Logic](#role-based-routing-logic)
4. [Token Handling Strategy](#token-handling-strategy)
5. [Why Redux Toolkit](#why-redux-toolkit)
6. [Security Considerations](#security-considerations)
7. [Trade-offs & Alternatives](#trade-offs--alternatives)

## Overview

### WHAT

Frontend authentication system integrated with backend API, featuring role-based routing, protected routes, and Redux state management.

### WHY

A secure, user-friendly authentication system is essential for:
- **User Experience**: Seamless login and role-based navigation
- **Security**: Proper token handling and route protection
- **Maintainability**: Centralized auth state and logic
- **Scalability**: Easy to extend with new roles and features

### HOW

The system uses:
- **Redux Toolkit**: Global auth state management
- **React Router**: Protected routes and role-based navigation
- **Axios**: API calls with automatic token injection
- **TypeScript**: Type safety throughout

## What is Implemented

### Core Features

1. **Authentication State Management**
   - Redux slice for auth state
   - Async thunks for login, logout, getCurrentUser
   - Loading and error states

2. **Login Flow**
   - Login form with validation
   - API integration with backend
   - Role-based redirection after login
   - Error handling and display

3. **Protected Routes**
   - `ProtectedRoute` component for authentication check
   - `RoleGuard` component for authorization check
   - Automatic redirects for unauthorized access

4. **Role-Based Routing**
   - SUPER_ADMIN → `/admin`
   - HR → `/hr`
   - EMPLOYEE → `/employee`
   - Automatic redirection based on role

5. **Token Management**
   - Access token stored in Redux (memory)
   - Automatic token injection in API requests
   - Token cleared on logout

6. **Accessibility**
   - Semantic HTML
   - ARIA labels and roles
   - Keyboard navigation
   - Screen reader support

### File Structure

```
packages/frontend/src/
├── features/
│   └── auth/
│       ├── authSlice.ts          # Redux slice
│       ├── authService.ts        # API calls
│       ├── types.ts              # TypeScript types
│       ├── hooks.ts              # Custom hooks
│       ├── components/
│       │   └── LoginForm.tsx    # Login form
│       └── pages/
│           └── LoginPage.tsx    # Login page
├── routes/
│   ├── ProtectedRoute.tsx       # Auth guard
│   └── RoleGuard.tsx            # Role guard
└── app/
    ├── App.tsx                  # Main app with routes
    └── store/
        └── index.ts            # Redux store
```

## Role-Based Routing Logic

### WHAT

Routing logic that directs users to appropriate dashboards based on their role after login.

### WHY

Role-based routing provides:
- **Better UX**: Users land on relevant dashboard immediately
- **Security**: Prevents access to unauthorized areas
- **Clarity**: Clear separation of concerns by role
- **Efficiency**: No need to navigate manually

### HOW

#### Login Flow

```
1. User submits login form
   ↓
2. Login API call (POST /api/auth/login)
   ↓
3. Backend returns: { accessToken, refreshToken, user }
   ↓
4. Redux state updated with user and token
   ↓
5. Role-based redirection:
   - SUPER_ADMIN → /admin
   - HR → /hr
   - EMPLOYEE → /employee
```

#### Route Protection

**ProtectedRoute:**
- Checks `isAuthenticated` from Redux
- Redirects to `/login` if not authenticated
- Renders children if authenticated

**RoleGuard:**
- Checks user role from Redux
- Compares with `allowedRoles` prop
- Redirects to appropriate dashboard if role doesn't match
- Renders children if role matches

#### Route Configuration

```typescript
// Admin route (SUPER_ADMIN only)
<Route
  path="/admin/*"
  element={
    <ProtectedRoute>
      <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN]}>
        <AdminDashboard />
      </RoleGuard>
    </ProtectedRoute>
  }
/>

// HR route (HR and SUPER_ADMIN)
<Route
  path="/hr/*"
  element={
    <ProtectedRoute>
      <RoleGuard allowedRoles={[UserRole.HR, UserRole.SUPER_ADMIN]}>
        <HRDashboard />
      </RoleGuard>
    </ProtectedRoute>
  }
/>
```

### Why Route-Level RBAC?

Even though backend enforces RBAC, frontend route-level checks provide:

1. **Better UX**: Immediate feedback, no API call needed
2. **Reduced Load**: Fewer unnecessary API requests
3. **Client-Side Protection**: Prevents unauthorized route access
4. **Faster Navigation**: No waiting for backend response
5. **Defense in Depth**: Multiple layers of security

**Note**: Frontend checks are for UX, backend checks are for security. Always enforce on backend.

## Token Handling Strategy

### WHAT

Strategy for storing and managing JWT tokens in the frontend.

### WHY

Proper token handling is critical for security:
- **XSS Protection**: Tokens in memory are safer than localStorage
- **Token Lifecycle**: Proper storage and cleanup
- **API Integration**: Automatic token injection

### HOW

#### Access Token Storage

**Location**: Redux state (in memory)

**Why in Memory?**
- ✅ **XSS Protection**: Not accessible to JavaScript if XSS occurs
- ✅ **Automatic Cleanup**: Cleared when tab closes
- ✅ **No Persistence**: Not stored on disk
- ✅ **Security**: Harder to steal than localStorage

**Trade-off**: Lost on page refresh (but can restore via getCurrentUser)

#### Refresh Token Storage

**Location**: NOT stored in Redux

**Why Not in Redux?**
- ❌ **XSS Risk**: Storing in Redux exposes to XSS attacks
- ❌ **Long-lived**: Refresh tokens are long-lived (7 days)
- ❌ **Security**: Should be in httpOnly cookie (backend) or secure storage

**Recommended Approach**:
- Backend sets httpOnly cookie (most secure)
- Or use secure storage (not implemented yet)

#### Token Injection

**How**: Axios default headers

```typescript
// Set in Redux slice after login
apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
```

**Why**: Automatic token injection for all API requests

#### Token Lifecycle

1. **Login**: Token stored in Redux, set in axios headers
2. **API Requests**: Token automatically included in headers
3. **Logout**: Token cleared from Redux and axios headers
4. **Page Refresh**: Token lost, but can restore via getCurrentUser

## Why Redux Toolkit

### Decision: Use Redux Toolkit for Auth State

**Why Redux Toolkit?**

1. **Simplified Boilerplate**
   - Less code than traditional Redux
   - createSlice generates actions and reducers
   - Built-in Immer for immutable updates

2. **Async Operations**
   - createAsyncThunk handles async logic
   - Automatic loading/error states
   - Type-safe async actions

3. **Developer Experience**
   - Redux DevTools integration
   - Better TypeScript support
   - Easier testing

4. **Global State**
   - Auth state needed across entire app
   - Multiple components need auth state
   - Centralized state management

5. **Scalability**
   - Easy to add more auth-related state
   - Can extend with middleware
   - Works well with other features

### Alternatives Considered

**1. Context API**
- ✅ Simpler for small apps
- ❌ Performance issues with frequent updates
- ❌ No DevTools
- ❌ More boilerplate for async operations

**Decision**: Rejected for scalability and developer experience

**2. Zustand**
- ✅ Simpler API
- ✅ Less boilerplate
- ❌ Smaller ecosystem
- ❌ Less tooling

**Decision**: Redux Toolkit chosen for maturity and ecosystem

**3. Local State Only**
- ✅ Simplest
- ❌ No global access
- ❌ Prop drilling
- ❌ State synchronization issues

**Decision**: Rejected for global state needs

## Security Considerations

### Token Storage

**Access Token:**
- ✅ Stored in Redux (memory)
- ✅ Not in localStorage
- ✅ Cleared on logout
- ✅ Lost on page refresh (acceptable trade-off)

**Refresh Token:**
- ❌ NOT stored in Redux
- ✅ Should be in httpOnly cookie (backend)
- ✅ Or secure storage (future implementation)

### XSS Protection

**Why Memory Storage?**
- localStorage is accessible to JavaScript
- XSS attacks can steal localStorage tokens
- Memory tokens are harder to steal
- Cleared automatically on tab close

**Trade-off**: Lost on refresh, but can restore via API

### Route Protection

**Frontend Checks:**
- Immediate feedback
- Better UX
- Reduced server load

**Backend Checks:**
- Always enforce on backend
- Frontend checks are for UX only
- Never trust client-side checks

### Error Messages

**Generic Messages:**
- "Invalid email or password" (prevents email enumeration)
- "Unauthorized access" (doesn't reveal why)
- "Insufficient permissions" (doesn't reveal what's needed)

### HTTPS

**Production Requirement:**
- Always use HTTPS in production
- Encrypts tokens in transit
- Prevents man-in-the-middle attacks

## Trade-offs & Alternatives

### Token Storage: Memory vs localStorage

**Memory (Chosen):**
- ✅ More secure (XSS protection)
- ✅ Automatic cleanup
- ❌ Lost on refresh
- ❌ Need to restore via API

**localStorage (Alternative):**
- ✅ Persists across refreshes
- ❌ XSS vulnerable
- ❌ Manual cleanup needed
- ❌ Less secure

**Decision**: Memory chosen for security

### State Management: Redux vs Context

**Redux Toolkit (Chosen):**
- ✅ Better performance
- ✅ DevTools
- ✅ Async handling
- ❌ More boilerplate

**Context API (Alternative):**
- ✅ Simpler
- ✅ Built-in
- ❌ Performance issues
- ❌ More boilerplate for async

**Decision**: Redux Toolkit chosen for scalability

### Route Protection: Frontend vs Backend Only

**Both (Chosen):**
- ✅ Frontend: Better UX
- ✅ Backend: Security
- ✅ Defense in depth

**Backend Only (Alternative):**
- ✅ Simpler frontend
- ❌ Worse UX (delayed feedback)
- ❌ More API calls

**Decision**: Both chosen for best UX and security

### Role-Based Routing: Automatic vs Manual

**Automatic (Chosen):**
- ✅ Better UX
- ✅ Less code
- ✅ Consistent

**Manual (Alternative):**
- ✅ More control
- ❌ More code
- ❌ Inconsistent

**Decision**: Automatic chosen for consistency

## API Integration

### Login Flow

```typescript
// 1. User submits form
const credentials = { email, password };

// 2. Call login action
await login(credentials);

// 3. Redux thunk calls API
const response = await authService.login(credentials);

// 4. Update Redux state
dispatch(loginUser.fulfilled(response));

// 5. Redirect based on role
navigate(`/${user.role.toLowerCase()}`);
```

### Token Injection

```typescript
// After login, token is set in axios defaults
apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// All subsequent requests automatically include token
await apiClient.get('/api/auth/me');
```

### Error Handling

```typescript
// Errors are caught in Redux thunk
catch (error) {
  return rejectWithValue(error.message);
}

// Displayed in component
const { error } = useAuth();
{error && <div role="alert">{error}</div>}
```

## Accessibility

### WCAG Compliance

**Login Form:**
- ✅ Semantic HTML (`<form>`, `<label>`, `<input>`)
- ✅ ARIA labels and roles
- ✅ Error announcements (`role="alert"`)
- ✅ Keyboard navigation
- ✅ Screen reader support

**Route Guards:**
- ✅ Loading states announced
- ✅ Redirects don't break navigation
- ✅ Accessible error messages

## Testing Considerations

### Unit Tests

- Auth slice reducers
- Auth service functions
- Custom hooks
- Form validation

### Integration Tests

- Login flow
- Route protection
- Role-based routing
- Token injection

### E2E Tests

- Complete login flow
- Protected route access
- Role-based redirection
- Logout flow

## Summary

### Key Features

✅ Redux Toolkit auth state  
✅ Role-based routing  
✅ Protected routes  
✅ Token in memory  
✅ Accessible login form  
✅ Error handling  
✅ TypeScript strict mode  

### Security Measures

✅ Access token in memory  
✅ Refresh token NOT in Redux  
✅ Route-level protection  
✅ Generic error messages  
✅ Backend enforcement (always)  

### Next Steps

1. Implement refresh token handling
2. Add token refresh on 401 errors
3. Add password reset flow
4. Add email verification
5. Add remember me functionality
6. Add session timeout

---

**Last Updated**: Initial implementation  
**Maintained By**: Frontend Team

