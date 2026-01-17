import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import adminHrReducer from '@/features/admin/hr/adminHrSlice';

// WHY: configureStore sets up Redux store with good defaults:
// - Redux DevTools integration
// - Thunk middleware for async actions
// - Development checks for common mistakes
export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminHr: adminHrReducer, // WHY: Add admin HR reducer for HR management
    // Add feature reducers here
  },
  // WHY: Enable Redux DevTools in development for debugging
  devTools: process.env.NODE_ENV !== 'production',
});

// WHY: TypeScript types for better developer experience
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

