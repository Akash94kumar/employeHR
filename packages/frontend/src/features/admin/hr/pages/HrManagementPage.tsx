import { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { PageContainer } from '@/shared/components/PageContainer';
import { Card } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { ChartCard } from '@/shared/components/ChartCard';
import { fetchHrUsers, openCreateModal } from '../adminHrSlice';
import { CreateHrModal } from '../components/CreateHrModal';
import { HrTable } from '../components/HrTable';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * WHAT: HR Management page for SUPER_ADMIN
 * 
 * WHY: Provides interface for SUPER_ADMIN to manage HR users.
 * Only accessible by SUPER_ADMIN role (enforced by route guard).
 * 
 * HOW: Page with analytics, table, and create modal
 */

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-2xl);
`;

const PageTitle = styled.h1`
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin: 0;
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

const ContentSection = styled.div`
  margin-top: var(--spacing-2xl);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
`;

const SectionTitle = styled.h2`
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin: 0;
`;

export default function HrManagementPage() {
  const dispatch = useDispatch();
  const { users, total, loading, error } = useSelector(
    (state: RootState) => state.adminHr,
  );

  /**
   * WHAT: Fetch HR users on component mount
   * 
   * WHY: Loads HR users list when page loads.
   * Ensures data is available for table and analytics.
   * 
   * HOW: Dispatches fetchHrUsers thunk
   */
  useEffect(() => {
    dispatch(fetchHrUsers());
  }, [dispatch]);

  /**
   * WHAT: Handle create button click
   * 
   * WHY: Opens create HR modal.
   * 
   * HOW: Dispatches openCreateModal action
   */
  const handleCreateClick = () => {
    dispatch(openCreateModal());
  };

  // WHY: Prepare chart data for HR analytics
  // Shows HR count over time (dummy data for now)
  const chartData = [
    { month: 'Jan', count: total },
    { month: 'Feb', count: total },
    { month: 'Mar', count: total },
    { month: 'Apr', count: total },
    { month: 'May', count: total },
    { month: 'Jun', count: total },
  ];

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>HR Management</PageTitle>
        <Button variant="primary" onClick={handleCreateClick}>
          + Create HR User
        </Button>
      </PageHeader>

      {/* WHY: Analytics card provides admin-level insights
       * Total HR count helps understand system scale
       * Charts help visualize trends (future: real data)
       */}
      <StatsGrid>
        <StatCard>
          <StatValue>{total}</StatValue>
          <StatLabel>Total HR Users</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>
            {users.filter((u) => u.isActive).length}
          </StatValue>
          <StatLabel>Active HR Users</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>
            {users.filter((u) => !u.isActive).length}
          </StatValue>
          <StatLabel>Inactive HR Users</StatLabel>
        </StatCard>
      </StatsGrid>

      {/* WHY: Chart provides visual representation of HR data
       * Helps admins understand trends and patterns
       * Currently shows dummy data, will be replaced with real analytics
       */}
      <ChartCard
        title="HR Users Overview"
        description="Total HR users count (last 6 months)"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} aria-label="HR users overview chart">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="var(--color-primary)" name="HR Users" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* WHY: Content section separates analytics from table
       * Provides clear visual hierarchy
       */}
      <ContentSection>
        <SectionHeader>
          <SectionTitle>HR Users List</SectionTitle>
        </SectionHeader>

        {error && (
          <Card padding="md" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <p style={{ color: 'var(--color-error)', margin: 0 }}>{error}</p>
          </Card>
        )}

        <HrTable users={users} loading={loading} />
      </ContentSection>

      {/* WHY: Modal for creating HR users
       * Provides focused UI for form completion
       */}
      <CreateHrModal />
    </PageContainer>
  );
}

