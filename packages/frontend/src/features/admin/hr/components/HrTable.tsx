import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { HrUser } from '../types';
import { updateHrStatus } from '../adminHrSlice';
import { Button } from '@/shared/components/Button';

/**
 * WHAT: HR users table component
 * 
 * WHY: Table provides clear, scannable view of HR users.
 * Enterprise-grade table with sorting, status indicators, and actions.
 * 
 * HOW: Styled table with user data, status badges, and action buttons
 */

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-md);
`;

const TableHeader = styled.thead`
  background: var(--color-bg-secondary);
`;

const TableHeaderRow = styled.tr`
  border-bottom: 2px solid var(--color-border);
`;

const TableHeaderCell = styled.th`
  padding: var(--spacing-md) var(--spacing-lg);
  text-align: left;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid var(--color-border);
  transition: background var(--transition-fast);

  &:hover {
    background: var(--color-surface-hover);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: var(--spacing-md) var(--spacing-lg);
  color: var(--color-text);
`;

const StatusBadge = styled.span<{ isActive: boolean }>`
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  background: ${(props) =>
    props.isActive ? 'var(--color-success-light)' : 'var(--color-error-light)'};
  color: ${(props) =>
    props.isActive ? 'var(--color-success)' : 'var(--color-error)'};
`;

const ActionsCell = styled(TableCell)`
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
`;

const EmptyState = styled.div`
  padding: var(--spacing-3xl);
  text-align: center;
  color: var(--color-text-secondary);
`;

interface HrTableProps {
  users: HrUser[];
  loading: boolean;
}

export function HrTable({ users, loading }: HrTableProps) {
  const dispatch = useDispatch();

  /**
   * WHAT: Handle status toggle
   * 
   * WHY: Toggles HR user active/inactive status.
   * Uses soft delete (isActive flag) instead of hard delete.
   * 
   * HOW: Dispatches updateHrStatus thunk
   */
  const handleToggleStatus = (user: HrUser) => {
    dispatch(
      updateHrStatus({
        userId: user.id,
        data: { isActive: !user.isActive },
      }),
    );
  };

  /**
   * WHAT: Format date for display
   * 
   * WHY: Converts ISO date string to readable format.
   * 
   * HOW: Formats date using Intl.DateTimeFormat
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading && users.length === 0) {
    return (
      <EmptyState>
        <p>Loading HR users...</p>
      </EmptyState>
    );
  }

  if (users.length === 0) {
    return (
      <EmptyState>
        <p>No HR users found. Create your first HR user to get started.</p>
      </EmptyState>
    );
  }

  return (
    <TableContainer>
      <Table aria-label="HR users table">
        <TableHeader>
          <TableHeaderRow>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Created Date</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableHeaderRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <StatusBadge isActive={user.isActive}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </StatusBadge>
              </TableCell>
              <TableCell>{formatDate(user.createdAt)}</TableCell>
              <ActionsCell>
                <Button
                  variant={user.isActive ? 'outline' : 'primary'}
                  size="sm"
                  onClick={() => handleToggleStatus(user)}
                  disabled={loading}
                  aria-label={`${user.isActive ? 'Deactivate' : 'Activate'} ${user.email}`}
                >
                  {user.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </ActionsCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

