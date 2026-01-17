import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAuth } from "@/features/auth/hooks";

/**
 * WHAT: Main application layout component
 *
 * WHY: Layout-based auth provides:
 * - Consistent structure across all protected pages
 * - Sidebar and header visible only when authenticated
 * - No need to conditionally render layout in every component
 * - Clean separation of layout from page content
 *
 * HOW: Wraps protected routes with sidebar and header
 */

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: var(--color-bg-secondary);
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 260px; /* WHY: Offset by sidebar width */
  margin-top: 64px; /* WHY: Offset by header height */
  padding: var(--spacing-lg);

  /* WHY: Responsive - full width on mobile */
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

/**
 * WHAT: App layout component
 *
 * WHY: Wraps all protected routes with consistent layout.
 * Sidebar and header only render when user is authenticated.
 * Uses React Router Outlet for nested routes.
 *
 * HOW: Conditionally renders sidebar/header based on auth state
 */
export function AppLayout() {
  const { isAuthenticated } = useAuth();

  // WHY: If not authenticated, redirect handled by ProtectedRoute
  // This component only renders when authenticated
  if (!isAuthenticated) {
    return null;
  }

  // WHY: Authenticated users get full layout with sidebar and header
  // Outlet renders nested route components
  return (
    <LayoutContainer>
      <Sidebar />
      <Header />
      <MainContent role="main">
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
}
