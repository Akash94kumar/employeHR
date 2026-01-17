import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/shared/components/PageContainer';
import { Card } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { UserRole } from '@/features/auth/types';

/**
 * WHAT: Home page with role-based login options
 * 
 * WHY: Provides clear entry point for different user roles.
 * Users can see available roles and navigate to login.
 * 
 * HOW: Displays role cards with descriptions and login buttons
 */

const HomeHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-3xl);
`;

const HomeTitle = styled.h1`
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HomeSubtitle = styled.p`
  font-size: var(--font-size-xl);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;
`;

const RolesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-3xl);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RoleCard = styled(Card)`
  display: flex;
  flex-direction: column;
  text-align: center;
  transition: all var(--transition-normal);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
  }
`;

const RoleIcon = styled.div<{ roleColor: string }>`
  width: 80px;
  height: 80px;
  border-radius: var(--radius-full);
  background: ${(props) => props.roleColor};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-lg);
  font-size: var(--font-size-3xl);
  color: var(--color-text-inverse);
  box-shadow: var(--shadow-md);
`;

const RoleTitle = styled.h3`
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin-bottom: var(--spacing-sm);
`;

const RoleDescription = styled.p`
  font-size: var(--font-size-md);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
  line-height: var(--line-height-relaxed);
  flex-grow: 1;
`;

const RoleFeatures = styled.ul`
  list-style: none;
  text-align: left;
  margin-bottom: var(--spacing-lg);
  padding: 0;
`;

const RoleFeature = styled.li`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
  padding-left: var(--spacing-md);
  position: relative;
  
  &::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--color-success);
    font-weight: var(--font-weight-bold);
  }
`;

const FeaturesSection = styled.section`
  margin-top: var(--spacing-3xl);
  padding: var(--spacing-2xl);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
`;

const FeaturesTitle = styled.h2`
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  text-align: center;
  margin-bottom: var(--spacing-xl);
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
`;

const FeatureCard = styled.div`
  text-align: center;
`;

const FeatureIcon = styled.div`
  font-size: var(--font-size-4xl);
  margin-bottom: var(--spacing-md);
`;

const FeatureTitle = styled.h4`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
`;

const FeatureDescription = styled.p`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
`;

/**
 * WHAT: Role configuration with colors and descriptions
 * 
 * WHY: Centralized role information for home page display.
 * Makes it easy to add/modify role information.
 * 
 * HOW: Array of role objects with display properties
 */
const roleConfig = [
  {
    role: UserRole.SUPER_ADMIN,
    title: 'Super Admin',
    icon: '👑',
    color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    description: 'Full system access and administration',
    features: [
      'System-wide analytics',
      'User management',
      'All HR features',
      'System configuration',
    ],
  },
  {
    role: UserRole.HR,
    title: 'HR Manager',
    icon: '👔',
    color: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    description: 'Human resources management and operations',
    features: [
      'Employee management',
      'Leave approvals',
      'Recruitment tracking',
      'HR analytics',
    ],
  },
  {
    role: UserRole.MANAGER,
    title: 'Manager',
    icon: '📊',
    color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    description: 'Team management and oversight',
    features: [
      'Team analytics',
      'Leave approvals',
      'Performance tracking',
      'Team reports',
    ],
  },
  {
    role: UserRole.EMPLOYEE,
    title: 'Employee',
    icon: '👤',
    color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    description: 'Personal dashboard and self-service',
    features: [
      'Personal analytics',
      'Leave requests',
      'Attendance tracking',
      'Profile management',
    ],
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  /**
   * WHAT: Handle role selection
   * 
   * WHY: Navigates to login page when user selects a role.
   * Login page will handle authentication for all roles.
   * 
   * HOW: Uses React Router navigate to go to login
   */
  const handleRoleSelect = () => {
    navigate('/login');
  };

  return (
    <PageContainer>
      <HomeHeader>
        <HomeTitle>Employee HR Portal</HomeTitle>
        <HomeSubtitle>
          Streamlined HR management for modern organizations.
          Select your role to continue.
        </HomeSubtitle>
      </HomeHeader>

      {/* WHY: Role cards provide clear entry points for different user types
       * Makes it easy for users to understand what each role can do
       */}
      <RolesGrid>
        {roleConfig.map((roleInfo) => (
          <RoleCard key={roleInfo.role} hover>
            <RoleIcon roleColor={roleInfo.color}>{roleInfo.icon}</RoleIcon>
            <RoleTitle>{roleInfo.title}</RoleTitle>
            <RoleDescription>{roleInfo.description}</RoleDescription>
            
            {/* WHY: Features list helps users understand role capabilities */}
            <RoleFeatures>
              {roleInfo.features.map((feature, index) => (
                <RoleFeature key={index}>{feature}</RoleFeature>
              ))}
            </RoleFeatures>

            {/* WHY: Login button navigates to login page
             * All roles use the same login screen
             */}
            <Button
              variant="primary"
              fullWidth
              onClick={handleRoleSelect}
              aria-label={`Login as ${roleInfo.title}`}
            >
              Login as {roleInfo.title}
            </Button>
          </RoleCard>
        ))}
      </RolesGrid>

      {/* WHY: Features section highlights portal capabilities
       * Provides additional information about the system
       */}
      <FeaturesSection>
        <FeaturesTitle>Platform Features</FeaturesTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>📈</FeatureIcon>
            <FeatureTitle>Analytics Dashboard</FeatureTitle>
            <FeatureDescription>
              Real-time insights and data visualization
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📅</FeatureIcon>
            <FeatureTitle>Leave Management</FeatureTitle>
            <FeatureDescription>
              Request, approve, and track leaves efficiently
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>👥</FeatureIcon>
            <FeatureTitle>Employee Management</FeatureTitle>
            <FeatureDescription>
              Comprehensive employee data and profiles
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🔒</FeatureIcon>
            <FeatureTitle>Secure & Reliable</FeatureTitle>
            <FeatureDescription>
              Enterprise-grade security and data protection
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
    </PageContainer>
  );
}
