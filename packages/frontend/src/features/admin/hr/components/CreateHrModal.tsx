import { useState, FormEvent } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { createHrUser, closeCreateModal, clearError } from '../adminHrSlice';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';

/**
 * WHAT: Create HR user modal component
 * 
 * WHY: Modal provides focused UI for creating HR users.
 * Prevents navigation away during form completion.
 * 
 * HOW: Styled modal with form, handles submission and errors
 */

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--spacing-md);
`;

const ModalContent = styled.div`
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  width: 100%;
  max-width: 500px;
  box-shadow: var(--shadow-xl);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
`;

const ModalTitle = styled.h2`
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: var(--font-size-2xl);
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);

  &:hover {
    background: var(--color-surface-hover);
    color: var(--color-text);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const FormNote = styled.p`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
  padding: var(--spacing-sm);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
`;

const ErrorMessage = styled.div`
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-error-light);
  color: var(--color-error);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-md);
`;

export function CreateHrModal() {
  const dispatch = useDispatch();
  const { loading, error, createModalOpen } = useSelector(
    (state: RootState) => state.adminHr,
  );

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  // WHY: Don't render if modal is closed
  if (!createModalOpen) return null;

  /**
   * WHAT: Handle form submission
   * 
   * WHY: Validates form and dispatches create HR action.
   * Prevents default form submission, handles errors.
   * 
   * HOW: Validates inputs, dispatches createHrUser thunk
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(clearError());

    // WHY: Client-side validation before API call
    if (!email || !name) {
      return;
    }

    // WHY: Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return;
    }

    // WHY: Dispatch create HR action
    // Password is optional - backend will auto-generate if not provided
    await dispatch(
      createHrUser({
        email,
        name,
        // WHY: No password field - backend auto-generates secure password
        // Admin can set password later if needed, or HR can reset on first login
      }),
    );
  };

  /**
   * WHAT: Handle modal close
   * 
   * WHY: Closes modal and resets form state.
   * 
   * HOW: Dispatches closeCreateModal action
   */
  const handleClose = () => {
    dispatch(closeCreateModal());
    setEmail('');
    setName('');
    dispatch(clearError());
  };

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Create HR User</ModalTitle>
          <CloseButton
            onClick={handleClose}
            aria-label="Close modal"
            type="button"
          >
            ×
          </CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit} aria-label="Create HR user form">
          {error && (
            <ErrorMessage role="alert" aria-live="polite">
              {error}
            </ErrorMessage>
          )}

          {/* WHY: Name input - required for HR user identification */}
          <Input
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter HR user name"
            required
            disabled={loading}
            fullWidth
          />

          {/* WHY: Email input - required for login and identification */}
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter HR user email"
            required
            disabled={loading}
            fullWidth
          />

          {/* WHY: Inform user about auto-generated password */}
          <FormNote>
            <strong>Note:</strong> A secure password will be auto-generated for
            this HR user. They can reset it on first login.
          </FormNote>

          {/* WHY: Role is fixed as HR - not user-selectable
           * This ensures only HR users are created through this interface
           * SUPER_ADMIN role cannot be assigned through UI (security)
           */}
          <FormNote>
            <strong>Role:</strong> HR (fixed - cannot be changed)
          </FormNote>

          <ButtonGroup>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <LoadingSpinner />
                  <span>Creating...</span>
                </>
              ) : (
                'Create HR User'
              )}
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
}

