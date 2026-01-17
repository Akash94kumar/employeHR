# Navigation & Logout Documentation

## Table of Contents

1. [Overview](#overview)
2. [Sidebar & Layout Architecture](#sidebar--layout-architecture)
3. [Role-Based Navigation Logic](#role-based-navigation-logic)
4. [Logout Flow](#logout-flow)
5. [Security Considerations](#security-considerations)
6. [Trade-offs & Future Enhancements](#trade-offs--future-enhancements)

## Overview

### WHAT

Persistent left sidebar navigation system with role-based menu items and complete logout functionality.

### WHY

- **Consistent UX**: Sidebar provides persistent navigation after login
- **Role-Based Access**: Users only see authorized menu items
- **Security**: Proper logout invalidates tokens on backend
- **Maintainability**: Config-driven navigation is easy to update

### HOW

- Layout-based architecture with `AppLayout` component
- Config-driven navigation menu
- Redux state management for auth
- Backend API integration for logout

## Sidebar & Layout Architecture

### Layout Structure

```
AppLayout
├── Sidebar (fixed left)
├── Header (fixed top)
└── MainContent (scrollable)
```

### Components

#### 1. AppLayout (`src/layouts/AppLayout.tsx`)

**Purpose**: Wraps all protected routes with consistent layout

**Why Layout-Based Auth?**
- **Consistency**: All protected pages have same structure
- **No Duplication**: Don't need to add sidebar/header to every page
- **Conditional Rendering**: Layout only shows when authenticated
- **Clean Separation**: Layout logic separate from page content

**How It Works**:
```typescript
if (!isAuthenticated) {
  return <>{children}</>; // No layout for login page
}
return (
  <LayoutContainer>
    <Sidebar />
    <Header />
    <MainContent>{children}</MainContent>
  </LayoutContainer>
);
```

#### 2. Sidebar (`src/layouts/Sidebar.tsx`)

**Purpose**: Left navigation menu with role-based items

**Features**:
- Fixed position on left
- Role-based menu filtering
- Active route highlighting
- Responsive (hidden on mobile)
- Keyboard navigable

**Styling**:
- Uses CSS variables for theming
- Fixed width: 260px
- Scrollable if content overflows
- Active item highlighted with primary color

#### 3. Header (`src/layouts/Header.tsx`)

**Purpose**: Top header with user info and logout

**Features**:
- User email display
- Role badge
- Logout button
- Fixed position
- Responsive (hides email on mobile)

### Layout Flow

```
Login Page → No Layout
     ↓
Authenticated → AppLayout
     ├── Sidebar (role-based menu)
     ├── Header (user info + logout)
     └── Page Content
```

## Role-Based Navigation Logic

### Navigation Config (`src/shared/config/navigation.ts`)

**Why Config-Driven Instead of Hardcoded JSX?**

1. **Single Source of Truth**
   - All menu items in one place
   - Easy to add/modify items
   - No scattered role checks

2. **Type Safety**
   - TypeScript interfaces ensure correctness
   - Autocomplete for menu properties
   - Compile-time error checking

3. **Maintainability**
   - Change route? Update config
   - Add new role? Update allowedRoles array
   - No need to modify multiple components

4. **Testability**
   - Easy to test navigation logic
   - Can mock config for tests
   - Clear separation of concerns

### Menu Structure

```typescript
{
  label: 'HR Management',
  route: '/admin/hr',
  allowedRoles: [UserRole.SUPER_ADMIN],
  icon: '👥',
}
```

### Role-Based Filtering

**Function**: `getNavigationItemsForRole(role)`

**How It Works**:
1. Filters `navigationConfig` array
2. Checks if user role is in `allowedRoles` array
3. Returns only authorized menu items

**Example**:
```typescript
// SUPER_ADMIN sees:
- Dashboard
- HR Management
- Reports

// HR sees:
- Dashboard
- Employees
- Attendance
- Leave Requests

// EMPLOYEE sees:
- Dashboard
- My Profile
- My Attendance
- My Leaves
```

### Menu Items by Role

#### SUPER_ADMIN
- Dashboard
- HR Management
- Reports
- Logout

#### HR
- Dashboard
- Employees
- Attendance
- Leave Requests
- Logout

#### EMPLOYEE
- Dashboard
- My Profile
- My Attendance
- My Leaves
- Logout

## Logout Flow

### Frontend Logout

**Steps**:
1. User clicks logout button
2. `handleLogout()` called
3. `logout()` action dispatched (from `useAuthActions`)
4. Redux `logoutUser` thunk executes
5. Backend logout API called
6. Redux state cleared
7. Redirect to `/login`

### Frontend Implementation

**Redux Slice** (`authSlice.ts`):
```typescript
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      await authService.logout(); // Backend API call
    } catch (error) {
      // Even if API fails, clear local state
    } finally {
      dispatch(clearAuthState()); // Clear Redux state
    }
  },
);
```

**Hook** (`hooks.ts`):
```typescript
const handleLogout = useCallback(async () => {
  await dispatch(logoutUser());
  navigate('/login');
}, [dispatch, navigate]);
```

### Backend Logout

**Why Backend Logout is Required Even with Short-Lived Access Tokens?**

1. **Refresh Token Invalidation**
   - Access tokens are short-lived (15 min)
   - Refresh tokens are long-lived (7 days)
   - Backend logout invalidates refresh token
   - Prevents token reuse after logout

2. **Security**
   - If refresh token is stolen, logout invalidates it
   - Prevents unauthorized token refresh
   - Server-side session management

3. **Audit Trail**
   - Logs logout events
   - Tracks user sessions
   - Compliance requirements

4. **Multi-Device Support**
   - Can invalidate all refresh tokens
   - Force logout from all devices
   - Better security control

**Backend Implementation**:
```typescript
// Removes refreshToken from user document
await User.findByIdAndUpdate(userId, {
  $unset: { refreshToken: 1 },
});
```

### Logout Flow Diagram

```
User Clicks Logout
     ↓
Frontend: dispatch(logoutUser())
     ↓
Backend: POST /api/auth/logout
     ↓
Backend: Invalidate refreshToken
     ↓
Frontend: Clear Redux state
     ↓
Frontend: Clear axios headers
     ↓
Frontend: Redirect to /login
```

### State Clearing

**What Gets Cleared**:
- `isAuthenticated` → `false`
- `user` → `null`
- `accessToken` → `null`
- Axios default headers
- Local storage (if used)

## Security Considerations

### 1. Token Invalidation

**Access Token**:
- Short-lived (15 minutes)
- Cleared from Redux on logout
- Not stored in localStorage (XSS protection)

**Refresh Token**:
- Long-lived (7 days)
- Stored in database
- Invalidated on backend logout
- Prevents token reuse

### 2. Route Protection

**Frontend**:
- `ProtectedRoute` checks authentication
- `RoleGuard` checks authorization
- Unauthorized users redirected to login

**Backend**:
- JWT verification middleware
- RBAC middleware
- Always validates on server

### 3. Navigation Security

**Menu Items**:
- Filtered by role on frontend
- Backend still enforces access
- Frontend filtering is UX, not security

**Why Frontend Filtering?**
- Better UX (don't show unauthorized links)
- Reduces confusion
- But backend must always enforce

## Trade-offs & Future Enhancements

### Current Trade-offs

1. **Sidebar Always Visible**
   - **Current**: Sidebar always shown when authenticated
   - **Trade-off**: Takes screen space
   - **Future**: Collapsible sidebar option

2. **Fixed Width Sidebar**
   - **Current**: 260px fixed width
   - **Trade-off**: May be too wide/narrow for some
   - **Future**: User-configurable width

3. **Mobile Sidebar**
   - **Current**: Hidden on mobile
   - **Trade-off**: No navigation on mobile
   - **Future**: Hamburger menu for mobile

4. **No Nested Menus**
   - **Current**: Flat menu structure
   - **Trade-off**: Limited organization
   - **Future**: Nested menu items support

### Future Enhancements

1. **Collapsible Sidebar**
   - Toggle to minimize/maximize
   - Icon-only mode
   - Saves screen space

2. **Breadcrumbs**
   - Show current location
   - Easy navigation back
   - Better UX for deep pages

3. **Search in Sidebar**
   - Quick navigation search
   - Find pages quickly
   - Power user feature

4. **Recent Pages**
   - Show recently visited pages
   - Quick access
   - Better navigation

5. **Favorites**
   - Pin favorite pages
   - Custom menu
   - Personalization

6. **Notifications in Header**
   - Notification bell
   - Badge count
   - Dropdown menu

7. **User Profile Menu**
   - Profile dropdown
   - Settings link
   - Logout option
   - Better UX

8. **Multi-Language Support**
   - Translate menu items
   - Language switcher
   - i18n integration

### Performance Considerations

1. **Lazy Loading**
   - Routes lazy loaded
   - Reduces initial bundle
   - Better performance

2. **Memoization**
   - Navigation items memoized
   - Prevents unnecessary re-renders
   - Better performance

3. **Code Splitting**
   - Layout components can be split
   - Load on demand
   - Faster initial load

## Usage Examples

### Adding New Menu Item

```typescript
// In navigation.ts
{
  label: 'New Feature',
  route: '/new-feature',
  allowedRoles: [UserRole.HR, UserRole.SUPER_ADMIN],
  icon: '⭐',
}
```

### Customizing Sidebar

```typescript
// In Sidebar.tsx
// Modify styling, add animations, etc.
```

### Logout from Code

```typescript
import { useAuthActions } from '@/features/auth/hooks';

const { logout } = useAuthActions();
await logout(); // Handles everything automatically
```

## Summary

### Key Features

✅ Persistent sidebar navigation  
✅ Role-based menu items  
✅ Config-driven navigation  
✅ Complete logout flow  
✅ Layout-based architecture  
✅ Responsive design  
✅ Accessible navigation  

### Architecture Decisions

✅ Config-driven navigation  
✅ Layout-based auth  
✅ Redux for state  
✅ Backend logout API  
✅ Token invalidation  

### Security

✅ Backend token invalidation  
✅ Frontend state clearing  
✅ Route protection  
✅ Role-based access  

---

**Last Updated**: Navigation & Logout Implementation  
**Maintained By**: Frontend Team

