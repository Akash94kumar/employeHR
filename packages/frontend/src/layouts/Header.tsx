import styled from 'styled-components';
import { useAuth, useAuthActions } from '@/features/auth/hooks';
import { Button } from '@/shared/components/Button';

/**
 * WHAT: Header component with user info and logout
 * 
 * WHY: Header provides:
 * - User information display
 * - Logout functionality
 * - Consistent header across all pages
 * 
 * HOW: Displays user email/role and logout button
 */

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 260px; /* WHY: Offset by sidebar width */
  right: 0;
  height: 64px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-lg);
  z-index: var(--z-sticky);
  
  /* WHY: Responsive - full width on mobile */
  @media (max-width: 768px) {
    left: 0;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const UserEmail = styled.span`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  
  @media (max-width: 768px) {
    display: none; /* WHY: Hide email on mobile to save space */
  }
`;

const UserRole = styled.span`
  font-size: var(--font-size-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const LogoutButton = styled(Button)`
  /* WHY: Smaller button for header */
  padding: var(--spacing-xs) var(--spacing-md);
`;

export function Header() {
  const { user } = useAuth();
  const { logout } = useAuthActions();

  // WHY: Don't render header if user is not authenticated
  if (!user) {
    return null;
  }

  /**
   * WHAT: Handle logout
   * 
   * WHY: Logs out user and redirects to login.
   * Calls backend to invalidate refresh token.
   * 
   * HOW: Dispatches logout action from auth hooks
   */
  const handleLogout = async () => {
    await logout();
  };

  return (
    <HeaderContainer role="banner">
      <div>
        {/* WHY: Empty div for future logo or branding */}
      </div>

      <UserInfo>
        <UserEmail>{user.email}</UserEmail>
        <UserRole>{user.role}</UserRole>
        <LogoutButton
          variant="outline"
          size="sm"
          onClick={handleLogout}
          aria-label="Logout"
        >
          Logout
        </LogoutButton>
      </UserInfo>
    </HeaderContainer>
  );
}

