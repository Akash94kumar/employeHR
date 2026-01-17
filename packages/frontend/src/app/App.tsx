import { Routes, Route, Navigate } from 'react-router-dom';
// WHY: Lazy loading reduces initial bundle size by code-splitting routes
import { lazy, Suspense, useEffect, useRef } from 'react';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { RoleGuard } from '@/routes/RoleGuard';
import { AppLayout } from '@/layouts/AppLayout';
import { useAuth, useAuthActions } from '@/features/auth/hooks';
import { UserRole } from '@/features/auth/types';

// WHY: Lazy load routes for better performance - only load code when route is accessed
const HomePage = lazy(() => import('@/features/home/pages/HomePage'));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));

// WHY: Lazy load role-specific dashboards
const AdminDashboard = lazy(() => import('@/features/admin/pages/AdminDashboard'));
const HrManagementPage = lazy(() => import('@/features/admin/hr/pages/HrManagementPage'));
const HRDashboard = lazy(() => import('@/features/hr/pages/HRDashboard'));
const EmployeeDashboard = lazy(() => import('@/features/employee/pages/EmployeeDashboard'));

/**
 * WHAT: Dashboard redirect component
 * 
 * WHY: Redirects to role-specific dashboard.
 * Cannot use hooks directly in Route element, so component is needed.
 * 
 * HOW: Uses useAuth hook to get user role and redirect accordingly
 */
function DashboardRedirect() {
  const { user } = useAuth();

  if (user?.role === UserRole.SUPER_ADMIN) {
    return <Navigate to="/admin" replace />;
  }
  if (user?.role === UserRole.HR) {
    return <Navigate to="/hr" replace />;
  }
  return <Navigate to="/employee" replace />;
}

/**
 * WHAT: App component with routing and authentication
 * 
 * WHY: Main app component sets up routing with authentication and role-based access.
 * Handles initial auth state restoration.
 * 
 * HOW: Uses React Router with protected routes and role guards
 */
function App() {
  const { isAuthenticated, loading } = useAuth();
  const { getCurrentUser } = useAuthActions();
  
  // WHY: Ref to track if getCurrentUser has been called
  // Prevents multiple API calls even if component re-renders
  const hasCheckedAuth = useRef(false);

  // WHY: Restore auth state on app load (only once)
  // Checks if user is still authenticated (token might be valid)
  // If token exists in localStorage, call getCurrentUser to restore session
  useEffect(() => {
    // WHY: Only check once - use ref to prevent multiple calls
    // Prevents multiple API calls on re-renders
    if (!hasCheckedAuth.current) {
      hasCheckedAuth.current = true;
      // WHY: Always try to restore session on app load
      // Token might be in localStorage from previous session
      // getCurrentUser will verify if token is still valid
      // Don't check isAuthenticated here - token might be in localStorage
      // but state not yet restored
      getCurrentUser();
    }
    // WHY: Empty dependency array ensures this runs only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  return (
    <div className="app">
      {/* WHY: Suspense provides fallback UI while lazy-loaded components load */}
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* WHY: Public routes - no authentication required */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* WHY: Public home route - shows home page with role selection
           * Authenticated users are redirected to their dashboard
           */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <HomePage />
              )
            }
          />

          {/* WHY: Protected routes wrapped with AppLayout
           * AppLayout provides sidebar and header for authenticated users
           * Layout-based approach ensures consistent UI across all protected pages
           */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* WHY: Dashboard route - redirects based on role */}
            <Route
              path="/dashboard"
              element={<DashboardRedirect />}
            />

            {/* WHY: Admin routes - SUPER_ADMIN only */}
            <Route
              path="/admin"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN]}>
                  <AdminDashboard />
                </RoleGuard>
              }
            />

            <Route
              path="/admin/hr"
              element={
                <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN]}>
                  <HrManagementPage />
                </RoleGuard>
              }
            />

            {/* WHY: HR routes - HR and SUPER_ADMIN */}
            <Route
              path="/hr"
              element={
                <RoleGuard allowedRoles={[UserRole.HR, UserRole.SUPER_ADMIN]}>
                  <HRDashboard />
                </RoleGuard>
              }
            />

            {/* WHY: Employee routes - All authenticated users */}
            <Route
              path="/employee"
              element={
                <RoleGuard
                  allowedRoles={[
                    UserRole.EMPLOYEE,
                    UserRole.MANAGER,
                    UserRole.HR,
                    UserRole.SUPER_ADMIN,
                  ]}
                >
                  <EmployeeDashboard />
                </RoleGuard>
              }
            />
          </Route>

          {/* WHY: Catch-all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;

