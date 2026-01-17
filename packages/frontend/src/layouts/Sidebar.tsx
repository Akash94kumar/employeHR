import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth, useAuthActions } from '@/features/auth/hooks';
import { getNavigationItemsForRole } from '@/shared/config/navigation';

/**
 * WHAT: Left sidebar navigation component
 * 
 * WHY: Sidebar provides persistent navigation after login.
 * Role-based menu items ensure users only see authorized links.
 * 
 * HOW: Renders navigation items based on user role, highlights active route
 */

const SidebarContainer = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 260px;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  z-index: var(--z-fixed);
  overflow-y: auto;
  
  /* WHY: Responsive - hide on mobile, show on desktop */
  @media (max-width: 768px) {
    transform: translateX(-100%);
    transition: transform var(--transition-normal);
    
    &.open {
      transform: translateX(0);
    }
  }
`;

const SidebarHeader = styled.div`
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
`;

const SidebarTitle = styled.h2`
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin: 0;
`;

const NavList = styled.nav`
  flex: 1;
  padding: var(--spacing-md) 0;
`;

const NavItem = styled.button<{ isActive: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  background: ${(props) =>
    props.isActive ? 'var(--color-primary)' : 'transparent'};
  color: ${(props) =>
    props.isActive ? 'var(--color-text-inverse)' : 'var(--color-text)'};
  border: none;
  text-align: left;
  font-size: var(--font-size-md);
  font-weight: ${(props) =>
    props.isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)'};
  cursor: pointer;
  transition: all var(--transition-fast);
  text-decoration: none;

  &:hover {
    background: ${(props) =>
      props.isActive
        ? 'var(--color-primary-dark)'
        : 'var(--color-surface-hover)'};
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: -2px;
  }
`;

const NavIcon = styled.span`
  font-size: var(--font-size-lg);
  width: 24px;
  text-align: center;
`;

const NavLabel = styled.span`
  flex: 1;
`;

const SidebarFooter = styled.div`
  padding: var(--spacing-md);
  border-top: 1px solid var(--color-border);
  margin-top: auto;
`;

const LogoutButton = styled(NavItem)`
  color: var(--color-error);
  
  &:hover {
    background: var(--color-error-light);
    color: var(--color-error);
  }
`;

export function Sidebar() {
  const { user } = useAuth();
  const { logout } = useAuthActions();
  const location = useLocation();
  const navigate = useNavigate();

  // WHY: Don't render sidebar if user is not authenticated
  if (!user) {
    return null;
  }

  // WHY: Get navigation items filtered by user role
  // Config-driven approach prevents hardcoded role checks
  const navItems = getNavigationItemsForRole(user.role);

  /**
   * WHAT: Handle navigation item click
   * 
   * WHY: Navigates to route when menu item is clicked.
   * 
   * HOW: Uses React Router navigate function
   */
  const handleNavClick = (route: string) => {
    navigate(route);
  };

  return (
    <SidebarContainer role="navigation" aria-label="Main navigation">
      <SidebarHeader>
        <SidebarTitle>HR Portal</SidebarTitle>
      </SidebarHeader>

      <NavList>
        {navItems.map((item) => {
          // WHY: Check if current route matches menu item
          // Highlights active route for better UX
          const isActive = location.pathname === item.route;

          return (
            <NavItem
              key={item.route}
              isActive={isActive}
              onClick={() => handleNavClick(item.route)}
              aria-current={isActive ? 'page' : undefined}
              type="button"
            >
              {item.icon && <NavIcon>{item.icon}</NavIcon>}
              <NavLabel>{item.label}</NavLabel>
            </NavItem>
          );
        })}
      </NavList>

      {/* WHY: Logout button in sidebar footer
       * Provides easy access to logout functionality
       * Always visible at bottom of sidebar
       */}
      <SidebarFooter>
        <LogoutButton
          isActive={false}
          onClick={logout}
          aria-label="Logout"
          type="button"
        >
          <NavIcon>🚪</NavIcon>
          <NavLabel>Logout</NavLabel>
        </LogoutButton>
      </SidebarFooter>
    </SidebarContainer>
  );
}

