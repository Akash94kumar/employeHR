/**
 * WHAT: Redux Toolkit slice for Admin HR Management state
 * 
 * WHY: Redux Toolkit provides:
 * - Simplified Redux boilerplate
 * - Built-in async thunk support
 * - Immutability helpers
 * - DevTools integration
 * 
 * WHY Redux instead of local state:
 * - HR list needs to be shared across components
 * - State persists across navigation
 * - Centralized error handling
 * - Better for complex state management
 * 
 * HOW: Manages HR users list, loading, errors, and modal state
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  AdminHrState,
  CreateHrRequest,
  UpdateHrStatusRequest,
  HrUser,
} from './types';
import * as adminHrService from './adminHrService';

/**
 * WHAT: Initial state for admin HR slice
 * 
 * WHY: Defines default state structure.
 * Empty users array, no loading, no errors initially.
 * 
 * HOW: Used when Redux store initializes
 */
const initialState: AdminHrState = {
  users: [],
  total: 0,
  loading: false,
  error: null,
  createModalOpen: false,
};

/**
 * WHAT: Async thunk for fetching HR users
 * 
 * WHY: Fetches list of HR users from backend.
 * Used to populate HR management table.
 * 
 * HOW: Calls getHrUsers API and updates state
 */
export const fetchHrUsers = createAsyncThunk(
  'adminHr/fetchHrUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminHrService.getHrUsers();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error?.message || 'Failed to fetch HR users',
      );
    }
  },
);

/**
 * WHAT: Async thunk for creating HR user
 * 
 * WHY: Creates new HR user account.
 * After creation, refreshes HR list to show new user.
 * 
 * HOW: Calls createHrUser API, then fetches updated list
 */
export const createHrUser = createAsyncThunk(
  'adminHr/createHrUser',
  async (data: CreateHrRequest, { rejectWithValue, dispatch }) => {
    try {
      const user = await adminHrService.createHrUser(data);
      // WHY: Refresh HR list after creation to show new user
      dispatch(fetchHrUsers());
      return user;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error?.message || 'Failed to create HR user',
      );
    }
  },
);

/**
 * WHAT: Async thunk for updating HR status
 * 
 * WHY: Toggles HR user active/inactive status.
 * Updates local state optimistically for better UX.
 * 
 * HOW: Calls updateHrStatus API and updates state
 */
export const updateHrStatus = createAsyncThunk(
  'adminHr/updateHrStatus',
  async (
    { userId, data }: { userId: string; data: UpdateHrStatusRequest },
    { rejectWithValue },
  ) => {
    try {
      const user = await adminHrService.updateHrStatus(userId, data);
      return user;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error?.message || 'Failed to update HR status',
      );
    }
  },
);

/**
 * WHAT: Admin HR slice
 * 
 * WHY: Redux slice manages all admin HR state.
 * Handles loading, errors, and user list updates.
 * 
 * HOW: Redux Toolkit slice with reducers and extra reducers
 */
const adminHrSlice = createSlice({
  name: 'adminHr',
  initialState,
  reducers: {
    /**
     * WHAT: Open create modal
     * 
     * WHY: Controls modal visibility.
     * Separated from async logic for better state management.
     */
    openCreateModal: (state) => {
      state.createModalOpen = true;
      state.error = null; // WHY: Clear errors when opening modal
    },

    /**
     * WHAT: Close create modal
     * 
     * WHY: Controls modal visibility.
     * Clears form state when closing.
     */
    closeCreateModal: (state) => {
      state.createModalOpen = false;
      state.error = null;
    },

    /**
     * WHAT: Clear error
     * 
     * WHY: Allows dismissing error messages.
     * Useful for user-initiated error clearing.
     */
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch HR users
    builder
      .addCase(fetchHrUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHrUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.total = action.payload.total;
      })
      .addCase(fetchHrUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create HR user
    builder
      .addCase(createHrUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHrUser.fulfilled, (state) => {
        state.loading = false;
        state.createModalOpen = false; // WHY: Close modal on success
      })
      .addCase(createHrUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update HR status
    builder
      .addCase(updateHrStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHrStatus.fulfilled, (state, action) => {
        state.loading = false;
        // WHY: Update user in list with new status
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateHrStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { openCreateModal, closeCreateModal, clearError } =
  adminHrSlice.actions;
export default adminHrSlice.reducer;

