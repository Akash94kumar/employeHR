import styled from 'styled-components';
import { PageContainer } from '@/shared/components/PageContainer';
import { Card } from '@/shared/components/Card';
import { ChartCard } from '@/shared/components/ChartCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

/**
 * WHAT: HR dashboard page
 * 
 * WHY: Dashboard for HR role with HR-specific analytics.
 * Provides insights into employee management, leaves, and recruitment.
 * 
 * HOW: Uses PageContainer, Cards, and Recharts for HR data visualization
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

const DashboardSubtitle = styled.p`
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

// WHY: Dummy data for HR charts - will be replaced with real API data
const leaveStatusData = [
  { status: 'Approved', count: 45 },
  { status: 'Pending', count: 12 },
  { status: 'Rejected', count: 3 },
];

const recruitmentData = [
  { position: 'Developer', applicants: 25, hired: 5 },
  { position: 'Designer', applicants: 18, hired: 3 },
  { position: 'Manager', applicants: 12, hired: 2 },
  { position: 'Analyst', applicants: 20, hired: 4 },
];

const COLORS = ['var(--color-success)', 'var(--color-warning)', 'var(--color-error)'];

export default function HRDashboard() {
  return (
    <PageContainer>
      <DashboardHeader>
        <DashboardTitle>HR Dashboard</DashboardTitle>
        <DashboardSubtitle>
          Human Resources management and analytics
        </DashboardSubtitle>
      </DashboardHeader>

      {/* WHY: HR-specific stats for quick overview */}
      <StatsGrid>
        <StatCard>
          <StatValue>60</StatValue>
          <StatLabel>Pending Leaves</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>15</StatValue>
          <StatLabel>Active Recruitments</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>8</StatValue>
          <StatLabel>New Joinings This Month</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>95%</StatValue>
          <StatLabel>Employee Satisfaction</StatLabel>
        </StatCard>
      </StatsGrid>

      {/* WHY: HR charts provide insights into:
       * - Leave management trends
       * - Recruitment pipeline
       * - Employee distribution
       */}
      <ChartsGrid>
        <ChartCard
          title="Leave Status Distribution"
          description="Current status of leave requests"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart aria-label="Leave status distribution chart">
              <Pie
                data={leaveStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, percent }) => `${status}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {leaveStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Recruitment Pipeline"
          description="Applicants and hires by position"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={recruitmentData}
              aria-label="Recruitment pipeline chart"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="position" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="applicants" fill="var(--color-info)" name="Applicants" />
              <Bar dataKey="hired" fill="var(--color-success)" name="Hired" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsGrid>
    </PageContainer>
  );
}

