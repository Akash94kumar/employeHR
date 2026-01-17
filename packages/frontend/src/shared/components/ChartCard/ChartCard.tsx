import styled from 'styled-components';
import { Card } from '../Card';

/**
 * WHAT: Chart card component wrapper
 * 
 * WHY: Provides consistent styling for chart containers.
 * Combines Card component with chart-specific styling.
 * 
 * HOW: Styled wrapper around Card component
 */

interface ChartCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
}

const ChartHeader = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const ChartTitle = styled.h3`
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
`;

const ChartDescription = styled.p`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
`;

const ChartContent = styled.div`
  width: 100%;
  height: 300px;
  
  /* WHY: Responsive height for mobile */
  @media (max-width: 768px) {
    height: 250px;
  }
`;

/**
 * WHAT: Chart card component
 * 
 * WHY: Wrapper for charts provides:
 * - Consistent card styling
 * - Title and description
 * - Responsive chart container
 * 
 * HOW: Renders Card with chart-specific content
 */
export function ChartCard({ title, description, children, ...props }: ChartCardProps) {
  return (
    <Card padding="lg" {...props}>
      <ChartHeader>
        <ChartTitle>{title}</ChartTitle>
        {description && <ChartDescription>{description}</ChartDescription>}
      </ChartHeader>
      <ChartContent>{children}</ChartContent>
    </Card>
  );
}

