import styled from "styled-components";
import { Link } from "react-router-dom";
import { PageContainer } from "@/shared/components/PageContainer";
import { Card } from "@/shared/components/Card";
import { ChartCard } from "@/shared/components/ChartCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

/**
 * WHAT: Admin dashboard page
 *
 * WHY: Dashboard for SUPER_ADMIN role with analytics and charts.
 * Provides overview of system-wide metrics and employee data.
 *
 * HOW: Uses PageContainer, Cards, and Recharts for data visualization
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

const QuickActions = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-2xl);
  flex-wrap: wrap;
`;

const QuickActionCard = styled(Card)`
  flex: 1;
  min-width: 200px;
  padding: var(--spacing-lg);
  text-align: center;
  transition: all var(--transition-fast);
  cursor: pointer;
  text-decoration: none;
  color: inherit;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
`;

const QuickActionTitle = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin-bottom: var(--spacing-sm);
`;

const QuickActionDescription = styled.p`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

// WHY: Dummy data for charts - will be replaced with real API data
const employeeCountData = [
  { department: "Engineering", employees: 45 },
  { department: "HR", employees: 12 },
  { department: "Sales", employees: 28 },
  { department: "Marketing", employees: 18 },
  { department: "Finance", employees: 15 },
];

const attendanceTrendData = [
  { month: "Jan", present: 95, absent: 5 },
  { month: "Feb", present: 92, absent: 8 },
  { month: "Mar", present: 98, absent: 2 },
  { month: "Apr", present: 94, absent: 6 },
  { month: "May", present: 96, absent: 4 },
  { month: "Jun", present: 97, absent: 3 },
];

export default function AdminDashboard() {
  return (
    <PageContainer>
      <DashboardHeader>
        <DashboardTitle>Admin Dashboard</DashboardTitle>
        <DashboardSubtitle>
          System-wide overview and analytics for SUPER_ADMIN
        </DashboardSubtitle>
      </DashboardHeader>

      {/* WHY: Quick actions provide easy navigation to admin modules
       * Makes it easy to access HR management and other admin features
       */}
      <QuickActions>
        <QuickActionCard as={Link} to="/admin/hr">
          <QuickActionTitle>HR Management</QuickActionTitle>
          <QuickActionDescription>
            Manage HR users, create accounts, and control access
          </QuickActionDescription>
        </QuickActionCard>
      </QuickActions>

      {/* WHY: Stats grid provides quick overview of key metrics */}
      <StatsGrid>
        <StatCard>
          <StatValue>1,250</StatValue>
          <StatLabel>Total Employees</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>98.5%</StatValue>
          <StatLabel>Attendance Rate</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>45</StatValue>
          <StatLabel>Active Departments</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>12</StatValue>
          <StatLabel>Pending Leaves</StatLabel>
        </StatCard>
      </StatsGrid>

      {/* WHY: Charts provide visual data representation
       * Essential for HR analytics and decision-making
       */}
      <ChartsGrid>
        <ChartCard
          title="Employees by Department"
          description="Distribution of employees across different departments"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={employeeCountData}
              aria-label="Employee count by department chart"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="employees"
                fill="var(--color-primary)"
                name="Employees"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Attendance Trend"
          description="Monthly attendance percentage over the last 6 months"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={attendanceTrendData}
              aria-label="Attendance trend chart"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="present"
                stroke="var(--color-success)"
                name="Present %"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="absent"
                stroke="var(--color-error)"
                name="Absent %"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsGrid>
    </PageContainer>
  );
}
