import styled from 'styled-components';
import { PageContainer } from '@/shared/components/PageContainer';
import { Card } from '@/shared/components/Card';
import { ChartCard } from '@/shared/components/ChartCard';
import { useAuth } from '@/features/auth/hooks';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

/**
 * WHAT: Employee dashboard page
 * 
 * WHY: Dashboard for EMPLOYEE role with personal analytics.
 * Provides insights into attendance, leaves, and performance.
 * 
 * HOW: Uses PageContainer, Cards, and Recharts for employee data visualization
 */

const DashboardHeader = styled.div`
  margin-bottom: var(--spacing-2xl);
`;

const DashboardTitle = styled.h1`
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin-bottom: var(--spacing-sm);
`;

const WelcomeText = styled.p`
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
`;

const StatCard = styled(Card)`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
`;

const StatLabel = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-lg);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// WHY: Dummy data for employee charts - will be replaced with real API data
const monthlyAttendanceData = [
  { month: 'Jan', hours: 160, target: 160 },
  { month: 'Feb', hours: 155, target: 160 },
  { month: 'Mar', hours: 162, target: 160 },
  { month: 'Apr', hours: 158, target: 160 },
  { month: 'May', hours: 160, target: 160 },
  { month: 'Jun', hours: 161, target: 160 },
];

const leaveBalanceData = [
  { type: 'Sick Leave', used: 2, remaining: 8 },
  { type: 'Casual Leave', used: 5, remaining: 7 },
  { type: 'Earned Leave', used: 10, remaining: 10 },
];

export default function EmployeeDashboard() {
  const { user } = useAuth();

  return (
    <PageContainer>
      <DashboardHeader>
        <DashboardTitle>Employee Dashboard</DashboardTitle>
        <WelcomeText>
          Welcome back, {user?.email}! Here's your personal overview.
        </WelcomeText>
      </DashboardHeader>

      {/* WHY: Employee-specific stats for personal overview */}
      <StatsGrid>
        <StatCard>
          <StatValue>98%</StatValue>
          <StatLabel>Attendance</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>25</StatValue>
          <StatLabel>Remaining Leaves</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>4.8</StatValue>
          <StatLabel>Performance Rating</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>2</StatValue>
          <StatLabel>Pending Requests</StatLabel>
        </StatCard>
      </StatsGrid>

      {/* WHY: Employee charts provide insights into:
       * - Personal attendance trends
       * - Leave balance
       * - Performance metrics
       */}
      <ChartsGrid>
        <ChartCard
          title="Monthly Attendance"
          description="Your work hours vs target for the last 6 months"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={monthlyAttendanceData}
              aria-label="Monthly attendance chart"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="target"
                stroke="var(--color-secondary)"
                fill="var(--color-secondary)"
                fillOpacity={0.3}
                name="Target Hours"
              />
              <Area
                type="monotone"
                dataKey="hours"
                stroke="var(--color-success)"
                fill="var(--color-success)"
                fillOpacity={0.6}
                name="Actual Hours"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Leave Balance"
          description="Your leave balance by type"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={leaveBalanceData}
              aria-label="Leave balance chart"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="used"
                stroke="var(--color-warning)"
                name="Used"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="remaining"
                stroke="var(--color-success)"
                name="Remaining"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsGrid>
    </PageContainer>
  );
}

