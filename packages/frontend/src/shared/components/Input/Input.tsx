import styled from 'styled-components';

/**
 * WHAT: Reusable Input component
 * 
 * WHY: Centralized input component provides:
 * - Consistent styling
 * - Accessibility built-in
 * - Error state handling
 * - Theme integration
 * 
 * HOW: Styled input with label and error message support
 */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

/**
 * WHAT: Input container for label and error
 * 
 * WHY: Wrapper provides structure for label and error message.
 * Keeps related elements together.
 * 
 * HOW: Styled div container
 */
const InputContainer = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.fullWidth ? '100%' : 'auto')};
  margin-bottom: var(--spacing-md);
`;

/**
 * WHAT: Label component
 * 
 * WHY: Styled label for consistent typography and spacing.
 * 
 * HOW: Styled label element
 */
const Label = styled.label`
  margin-bottom: var(--spacing-xs);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
`;

/**
 * WHAT: Styled input component
 * 
 * WHY: Styled input provides:
 * - Consistent appearance
 * - Error state styling
 * - Focus states
 * - Theme integration
 * 
 * HOW: Uses styled.input with error-based styling
 */
const StyledInput = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-md);
  line-height: var(--line-height-normal);
  color: var(--color-text);
  background-color: var(--color-bg);
  border: 1px solid ${(props) => (props.hasError ? 'var(--color-error)' : 'var(--color-border)')};
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);

  /* WHY: Focus state for accessibility */
  &:focus {
    outline: none;
    border-color: ${(props) => (props.hasError ? 'var(--color-error)' : 'var(--color-primary)')};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.hasError
          ? 'rgba(239, 68, 68, 0.1)'
          : 'rgba(37, 99, 235, 0.1)'};
  }

  /* WHY: Disabled state */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--color-bg-secondary);
  }

  /* WHY: Placeholder styling */
  &::placeholder {
    color: var(--color-text-muted);
  }
`;

/**
 * WHAT: Error message component
 * 
 * WHY: Styled error message for consistent error display.
 * 
 * HOW: Styled span with error styling
 */
const ErrorMessage = styled.span`
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-error);
`;

/**
 * WHAT: Input component
 * 
 * WHY: Wrapper provides:
 * - Label support
 * - Error handling
 * - Accessibility
 * 
 * HOW: Renders input with label and error message
 */
export function Input({
  label,
  error,
  fullWidth = false,
  id,
  ...props
}: InputProps) {
  // WHY: Generate ID if not provided (for label association)
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <InputContainer fullWidth={fullWidth}>
      {label && (
        <Label htmlFor={inputId}>
          {label}
          {props.required && <span aria-label="required"> *</span>}
        </Label>
      )}
      <StyledInput
        id={inputId}
        hasError={!!error}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <ErrorMessage id={`${inputId}-error`} role="alert">
          {error}
        </ErrorMessage>
      )}
    </InputContainer>
  );
}

