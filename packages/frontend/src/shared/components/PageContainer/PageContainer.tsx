import styled from 'styled-components';

/**
 * WHAT: Page container component
 * 
 * WHY: Page container provides:
 * - Consistent page layout
 * - Max width for readability
 * - Consistent padding
 * - Centered content
 * 
 * HOW: Styled container with max-width and padding
 */

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

/**
 * WHAT: Styled page container
 * 
 * WHY: Provides consistent page layout across application.
 * Max width prevents content from being too wide (readability).
 * 
 * HOW: Uses styled.div with max-width variants
 */
const StyledPageContainer = styled.div<PageContainerProps>`
  width: 100%;
  max-width: ${(props) => {
    // WHY: Different max widths for different page types
    switch (props.maxWidth) {
      case 'sm':
        return '640px';
      case 'md':
        return '768px';
      case 'lg':
        return '1024px';
      case 'xl':
        return '1280px';
      case 'full':
        return '100%';
      default:
        return '1200px'; // Default max width
    }
  }};
  
  margin: 0 auto;
  padding: var(--spacing-lg) var(--spacing-md);
  
  /* WHY: Responsive padding on smaller screens */
  @media (max-width: 768px) {
    padding: var(--spacing-md) var(--spacing-sm);
  }
`;

/**
 * WHAT: Page container component
 * 
 * WHY: Wrapper provides:
 * - Consistent layout
 * - Type safety
 * - Responsive behavior
 * 
 * HOW: Renders StyledPageContainer with props
 */
export function PageContainer({
  maxWidth = 'xl',
  children,
  ...props
}: PageContainerProps) {
  return (
    <StyledPageContainer maxWidth={maxWidth} {...props}>
      {children}
    </StyledPageContainer>
  );
}

