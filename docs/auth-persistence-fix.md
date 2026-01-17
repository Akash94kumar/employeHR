# Auth Persistence Fix Documentation

## Problem

After login, when page was refreshed, user was redirected to login page. This happened because:
1. Access token was stored only in Redux memory
2. On page refresh, Redux state is lost
3. `getCurrentUser` API call failed because token was not available
4. User was logged out automatically

## Solution

### 1. Token Persistence in localStorage

**WHAT**: Store access token in localStorage for persistence across page refreshes.

**WHY**: 
- Redux state is lost on page refresh
- localStorage persists across page reloads
- Allows user to stay logged in after refresh

**HOW**: 
- Token is stored in localStorage on successful login
- Token is retrieved from localStorage on app load
- Token is set in axios headers before API calls
- Token is removed from localStorage on logout

**Implementation**:
```typescript
// Store token
localStorage.setItem('hr_portal_access_token', token);

// Retrieve token
const token = localStorage.getItem('hr_portal_access_token');

// Remove token
localStorage.removeItem('hr_portal_access_token');
```

### 2. Token Restoration on App Load

**WHAT**: Restore token from localStorage and set in axios headers on app initialization.

**WHY**: 
- Token must be available before `getCurrentUser` API call
- Axios needs token in headers for authenticated requests

**HOW**:
- Check localStorage for token on app load
- If token exists, set it in Redux state and axios headers
- Then call `getCurrentUser` to verify token validity

### 3. Enhanced Error Handling

**WHAT**: Clear localStorage on 401 errors (unauthorized).

**WHY**: 
- If token is invalid/expired, clear it from storage
- Prevents infinite redirect loops
- Ensures clean logout on token expiration

**HOW**:
- Response interceptor checks for 401 status
- Clears token from localStorage
- Clears axios headers
- Redirects to login page

## Login Flow

1. User enters credentials
2. Login API called
3. Token received from backend
4. Token stored in:
   - Redux state (for current session)
   - localStorage (for persistence)
   - Axios headers (for API calls)
5. User redirected to dashboard

## Page Refresh Flow

1. App loads
2. Check localStorage for token
3. If token exists:
   - Set in Redux state
   - Set in axios headers
   - Call `getCurrentUser` API
   - If API succeeds: User stays logged in
   - If API fails: Token invalid, clear and redirect to login
4. If no token: User not logged in

## Logout Flow

1. User clicks logout
2. Call backend logout API (invalidate refresh token)
3. Clear token from:
   - Redux state
   - localStorage
   - Axios headers
4. Redirect to login page

## Security Considerations

### Token Storage

**Current Implementation**: localStorage
- ✅ Persists across page refreshes
- ✅ Easy to implement
- ⚠️ Vulnerable to XSS attacks
- ⚠️ Accessible to JavaScript

**Future Improvements**:
- Use httpOnly cookies for refresh token (backend)
- Use secure storage for access token
- Implement token rotation
- Add CSRF protection

### Token Expiration

**Current**: Token expires after 15 minutes (backend JWT expiry)
**Handling**: 
- 401 error triggers logout
- Token cleared from storage
- User redirected to login

**Future**: Implement automatic token refresh using refresh token

## Files Modified

1. `packages/frontend/src/features/auth/authSlice.ts`
   - Added localStorage token storage functions
   - Restore token on app load
   - Store token on login
   - Remove token on logout

2. `packages/frontend/src/app/App.tsx`
   - Updated `getCurrentUser` call logic
   - Always attempt to restore session on app load

3. `packages/frontend/src/shared/utils/api.ts`
   - Enhanced 401 error handling
   - Clear localStorage on unauthorized errors

## Testing

### Test Cases

1. **Login and Refresh**
   - Login as any role
   - Refresh page
   - ✅ Should stay logged in
   - ✅ Should see dashboard

2. **Logout**
   - Click logout button
   - ✅ Should redirect to login
   - ✅ Token should be cleared
   - Refresh page
   - ✅ Should stay on login page

3. **Token Expiration**
   - Login and wait for token to expire (15 min)
   - Make API call
   - ✅ Should get 401 error
   - ✅ Should redirect to login
   - ✅ Token should be cleared

4. **Multiple Tabs**
   - Login in one tab
   - Open new tab
   - ✅ Should be logged in
   - Logout in one tab
   - ✅ Other tab should detect logout (future: implement)

## Known Limitations

1. **No Automatic Token Refresh**
   - Token expires after 15 minutes
   - User must login again
   - **Future**: Implement refresh token flow

2. **No Multi-Tab Sync**
   - Logout in one tab doesn't affect other tabs
   - **Future**: Use BroadcastChannel API

3. **XSS Vulnerability**
   - Token in localStorage can be accessed by malicious scripts
   - **Future**: Use httpOnly cookies

## Next Steps

1. ✅ Token persistence implemented
2. ⏳ Remove hardcoded dashboard data
3. ⏳ Fetch real data from database
4. ⏳ Implement automatic token refresh
5. ⏳ Add multi-tab logout sync

---

**Last Updated**: Auth Persistence Fix  
**Status**: ✅ Implemented

