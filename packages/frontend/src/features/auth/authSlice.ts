import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, LoginRequest } from "./types";
import * as authService from "./authService";
import apiClient from "@/shared/utils/api";

/**
 * WHAT: Redux Toolkit slice for authentication state management
 *
 * WHY: Redux Toolkit provides:
 * - Simplified Redux boilerplate
 * - Built-in async thunk support
 * - Immutable updates with Immer
 * - DevTools integration
 * - Type safety with TypeScript
 *
 * Centralized auth state allows:
 * - Global access to auth state
 * - Consistent state updates
 * - Easy testing
 *
 * HOW: Uses createSlice for reducer and actions, createAsyncThunk for async operations
 */

/**
 * WHAT: Token storage key for localStorage
 *
 * WHY: Centralized key name for token storage.
 * Makes it easy to change storage key if needed.
 */
const ACCESS_TOKEN_KEY = "hr_portal_access_token";

/**
 * WHAT: Get stored access token from localStorage
 *
 * WHY: Restores token on page refresh.
 * Token is stored in localStorage for persistence across page reloads.
 *
 * HOW: Reads token from localStorage
 */
function getStoredAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    // WHY: localStorage might not be available (SSR, private browsing)
    return null;
  }
}

/**
 * WHAT: Store access token in localStorage
 *
 * WHY: Persists token across page refreshes.
 * Allows user to stay logged in after refresh.
 *
 * HOW: Saves token to localStorage
 */
function storeAccessToken(token: string): void {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch (error) {
    // WHY: localStorage might not be available
    console.error("Failed to store access token:", error);
  }
}

/**
 * WHAT: Remove access token from localStorage
 *
 * WHY: Clears token on logout.
 * Ensures user is logged out after token removal.
 *
 * HOW: Removes token from localStorage
 */
function removeStoredAccessToken(): void {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    // WHY: localStorage might not be available
    console.error("Failed to remove access token:", error);
  }
}

/**
 * WHAT: Initial authentication state
 *
 * WHY: Defines default state when app loads.
 * Restores token from localStorage if available.
 *
 * HOW: Used as initial state in auth slice
 */
const storedToken = getStoredAccessToken();

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: storedToken, // WHY: Restore token from localStorage on app load
  loading: false,
  error: null,
};

// WHY: Set axios header if token exists on app load
// This allows getCurrentUser to work on page refresh
if (storedToken) {
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
}

/**
 * WHAT: Async thunk for user login
 *
 * WHY: createAsyncThunk handles async operations with loading/error states.
 * Automatically generates pending/fulfilled/rejected actions.
 *
 * HOW: Calls auth service, updates state based on result
 */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);

      // WHY: Store access token in memory (Redux state)
      // Refresh token is NOT stored here - it's handled separately (httpOnly cookie or secure storage)
      // Access token in memory is more secure than localStorage (XSS protection)

      return {
        accessToken: response.accessToken,
        user: response.user,
        // WHY: Refresh token is NOT stored in Redux
        // It should be stored in httpOnly cookie (backend) or secure storage
        // Storing in Redux would expose it to XSS attacks
      };
    } catch (error: any) {
      // WHY: Extract error message for user-friendly display
      return rejectWithValue(
        error.response?.data?.error?.message ||
          "Login failed. Please try again.",
      );
    }
  },
);

/**
 * WHAT: Async thunk for getting current user
 *
 * WHY: Restores auth state on app reload.
 * Checks if user is still authenticated by calling backend.
 *
 * HOW: Calls /api/auth/me endpoint
 */
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue, getState }) => {
    try {
      // WHY: Check if we already have user data to prevent unnecessary API calls
      const state = getState() as { auth: AuthState };
      if (state.auth.user && state.auth.isAuthenticated) {
        // WHY: If user already exists, return it without API call
        return state.auth.user;
      }

      const response = await authService.getCurrentUser();
      return response.data.user;
    } catch (error: any) {
      // WHY: If getCurrentUser fails, user is not authenticated
      return rejectWithValue(null);
    }
  },
);

/**
 * WHAT: Async thunk for user logout
 *
 * WHY: Logs out user and clears auth state.
 * Calls backend to invalidate refresh token.
 *
 * HOW: Calls logout API, then clears Redux state
 */
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      await authService.logout();
    } catch (error) {
      // WHY: Even if logout API fails, clear local state
      // User should be logged out locally regardless
    } finally {
      // WHY: Clear auth state after logout (success or failure)
      dispatch(clearAuthState());
    }
  },
);

/**
 * WHAT: Auth slice with reducers and actions
 *
 * WHY: createSlice automatically generates actions and reducers.
 * Reducers handle state updates for sync and async operations.
 *
 * HOW: Defines reducers for each action type
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * WHAT: Clear authentication state
     *
     * WHY: Used on logout to reset auth state.
     * Separate reducer allows clearing state without API call.
     *
     * HOW: Resets state to initial values
     */
    clearAuthState: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.error = null;
      // WHY: Remove token from localStorage on logout
      removeStoredAccessToken();
      // WHY: Remove token from axios interceptor
      delete apiClient.defaults.headers.common["Authorization"];
    },

    /**
     * WHAT: Set access token
     *
     * WHY: Allows updating token without full login flow.
     * Used when refreshing access token.
     *
     * HOW: Updates accessToken in state and axios headers
     */
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      // WHY: Update axios default headers for subsequent requests
      apiClient.defaults.headers.common["Authorization"] =
        `Bearer ${action.payload}`;
    },

    /**
     * WHAT: Clear error
     *
     * WHY: Allows clearing error state manually.
     * Useful for dismissing error messages.
     *
     * HOW: Sets error to null
     */
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // WHY: extraReducers handle async thunk actions
    // Automatically generated by createAsyncThunk

    // Login pending
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    // Login fulfilled
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      // WHY: Store token in localStorage for persistence across page refreshes
      storeAccessToken(action.payload.accessToken);
      // WHY: Set axios default header for all subsequent requests
      apiClient.defaults.headers.common["Authorization"] =
        `Bearer ${action.payload.accessToken}`;
    });

    // Login rejected
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload as string;
    });

    // Get current user pending
    builder.addCase(getCurrentUser.pending, (state) => {
      state.loading = true;
    });

    // Get current user fulfilled
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      // WHY: If token exists in localStorage but not in state, restore it
      // This ensures token is available after page refresh
      if (!state.accessToken) {
        const storedToken = getStoredAccessToken();
        if (storedToken) {
          state.accessToken = storedToken;
          apiClient.defaults.headers.common["Authorization"] =
            `Bearer ${storedToken}`;
        }
      }
    });

    // Get current user rejected
    builder.addCase(getCurrentUser.rejected, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    });

    // Logout fulfilled
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      // WHY: Remove token from localStorage on logout
      removeStoredAccessToken();
    });
  },
});

export const { clearAuthState, setAccessToken, clearError } = authSlice.actions;
export default authSlice.reducer;
