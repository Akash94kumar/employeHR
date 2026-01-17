# Design System Documentation

## Table of Contents

1. [Overview](#overview)
2. [What is Implemented](#what-is-implemented)
3. [Why styled-components](#why-styled-components)
4. [Why Global CSS Variables](#why-global-css-variables)
5. [How Theming Works](#how-theming-works)
6. [How Charts are Structured](#how-charts-are-structured)
7. [Trade-offs & Alternatives](#trade-offs--alternatives)

## Overview

### WHAT

Enterprise-grade design system built with styled-components, CSS variables, and Recharts for data visualization. Provides consistent UI foundation across the HR portal.

### WHY

A well-designed design system provides:
- **Consistency**: Unified look and feel across application
- **Maintainability**: Single source of truth for design tokens
- **Scalability**: Easy to extend and modify
- **Developer Experience**: Reusable components reduce development time
- **Accessibility**: Built-in accessibility features

### HOW

The system uses:
- **styled-components**: CSS-in-JS for component styling
- **CSS Variables**: Design tokens for theming
- **Recharts**: Data visualization library
- **TypeScript**: Type safety throughout

## What is Implemented

### Core Design System

1. **Global Styles**
   - CSS reset and base styles
   - Typography system
   - Accessibility improvements
   - CSS variables definition

2. **Design Tokens**
   - Colors (primary, secondary, semantic)
   - Spacing scale (xs to 3xl)
   - Typography (sizes, weights, line heights)
   - Border radius
   - Shadows
   - Transitions
   - Z-index scale

3. **Reusable Components**
   - **Button**: Primary, secondary, outline, ghost variants
   - **Card**: Container with elevation
   - **Input**: Form input with label and error handling
   - **PageContainer**: Consistent page layout
   - **ChartCard**: Chart container with title and description

4. **Dashboards**
   - **AdminDashboard**: System-wide analytics
   - **HRDashboard**: HR-specific metrics
   - **EmployeeDashboard**: Personal analytics
   - Each with role-appropriate charts

5. **Charts**
   - Bar charts (employee distribution, recruitment)
   - Line charts (attendance trends)
   - Area charts (monthly attendance)
   - Pie charts (leave status)

### File Structure

```
packages/frontend/src/
├── styles/
│   ├── GlobalStyle.ts        # Global styles
│   ├── theme.ts              # TypeScript theme
│   └── variables.css         # CSS variables
├── shared/
│   └── components/
│       ├── Button/           # Button component
│       ├── Card/             # Card component
│       ├── Input/            # Input component
│       ├── PageContainer/    # Page container
│       └── ChartCard/        # Chart wrapper
└── features/
    ├── admin/pages/AdminDashboard.tsx
    ├── hr/pages/HRDashboard.tsx
    └── employee/pages/EmployeeDashboard.tsx
```

## Why styled-components

### Decision: Use styled-components for CSS-in-JS

**Why styled-components?**

1. **Component Scoping**
   - Styles are scoped to components
   - No CSS class name conflicts
   - Automatic vendor prefixing

2. **Theme Integration**
   - Built-in ThemeProvider
   - TypeScript support
   - Dynamic styling based on props

3. **Developer Experience**
   - Co-located styles with components
   - TypeScript autocomplete
   - Better debugging (component names in DevTools)

4. **Performance**
   - Only renders styles for used components
   - Automatic code splitting
   - CSS-in-JS optimization

5. **React Integration**
   - Props-based styling
   - Conditional styles
   - Media queries support

### Alternatives Considered

**1. CSS Modules**
- ✅ Scoped styles
- ✅ Standard CSS
- ❌ No theme integration
- ❌ No dynamic styling

**Decision**: styled-components chosen for theme integration and dynamic styling

**2. Tailwind CSS**
- ✅ Utility-first approach
- ✅ Fast development
- ❌ Less component abstraction
- ❌ Larger bundle size

**Decision**: styled-components chosen for component-based approach

**3. Plain CSS**
- ✅ Simple
- ✅ No dependencies
- ❌ No scoping
- ❌ No theme integration
- ❌ Class name conflicts

**Decision**: styled-components chosen for enterprise needs

## Why Global CSS Variables

### Decision: Use CSS Variables for Design Tokens

**Why CSS Variables?**

1. **Runtime Theming**
   - Can switch themes without rebuild
   - Browser-native (no JS overhead)
   - Works with both CSS and styled-components

2. **Performance**
   - Browser-optimized
   - No JavaScript execution needed
   - Faster than JS-based theming

3. **Compatibility**
   - Works with CSS and styled-components
   - Can be overridden per component
   - Media query support

4. **Maintainability**
   - Single source of truth
   - Easy to update globally
   - Clear naming convention

5. **Future-Proof**
   - Dark mode ready
   - Theme switching ready
   - Browser standard

### Why Not JS-Only Theming?

**JS-Only Theming (Alternative):**
- ❌ Requires JavaScript execution
- ❌ Slower performance
- ❌ Doesn't work with plain CSS
- ❌ More complex

**Decision**: CSS variables chosen for performance and compatibility

### CSS Variables Structure

```css
:root {
  --color-primary: #2563eb;
  --spacing-md: 1rem;
  --radius-md: 0.5rem;
  --shadow-md: 0 4px 6px...;
}
```

**Usage:**
```css
/* In CSS */
.button {
  background: var(--color-primary);
  padding: var(--spacing-md);
}

/* In styled-components */
const Button = styled.button`
  background: var(--color-primary);
  padding: var(--spacing-md);
`;
```

## How Theming Works

### WHAT

Theme system that provides design tokens to styled-components and CSS.

### WHY

Theming allows:
- Consistent design tokens
- Easy theme switching (future)
- Type safety
- Single source of truth

### HOW

#### 1. CSS Variables (variables.css)

```css
:root {
  --color-primary: #2563eb;
  --spacing-md: 1rem;
}
```

**Why**: Browser-native, performant, works everywhere

#### 2. TypeScript Theme (theme.ts)

```typescript
export const theme = {
  colors: {
    primary: 'var(--color-primary)',
  },
  spacing: {
    md: 'var(--spacing-md)',
  },
};
```

**Why**: Type safety, autocomplete, styled-components integration

#### 3. ThemeProvider (main.tsx)

```typescript
<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

**Why**: Makes theme available to all styled-components

#### 4. Usage in Components

```typescript
// Using CSS variables (works everywhere)
const Button = styled.button`
  background: var(--color-primary);
`;

// Using theme (styled-components only)
const Button = styled.button`
  background: ${props => props.theme.colors.primary};
`;
```

**Why Both?**: CSS variables for universal access, theme for TypeScript safety

## How Charts are Structured

### WHAT

Chart components using Recharts library for data visualization in HR dashboards.

### WHY

Charts in HR systems provide:
- **Visual Data**: Easier to understand than tables
- **Trends**: Identify patterns over time
- **Comparisons**: Compare metrics across departments
- **Decision Making**: Data-driven HR decisions

### HOW

#### Chart Structure

```typescript
<ChartCard title="Chart Title" description="Chart description">
  <ResponsiveContainer>
    <BarChart data={data}>
      <CartesianGrid />
      <XAxis />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="value" />
    </BarChart>
  </ResponsiveContainer>
</ChartCard>
```

#### Why Recharts?

1. **React Native**: Built for React
2. **Accessibility**: ARIA support
3. **Responsive**: ResponsiveContainer handles sizing
4. **Customizable**: Highly configurable
5. **TypeScript**: Full TypeScript support

#### Chart Types Used

**Bar Chart:**
- Employee distribution by department
- Recruitment pipeline
- **Why**: Good for comparing categories

**Line Chart:**
- Attendance trends
- Leave balance over time
- **Why**: Good for showing trends

**Area Chart:**
- Monthly attendance vs target
- **Why**: Good for showing volume and trends

**Pie Chart:**
- Leave status distribution
- **Why**: Good for showing proportions

#### Accessibility

All charts include:
- `aria-label`: Screen reader description
- Tooltips: Data on hover
- Legends: Data series identification
- Responsive: Works on mobile

## Component Architecture

### Button Component

**Why**: Centralized button styling ensures consistency

**Variants:**
- `primary`: Main actions
- `secondary`: Secondary actions
- `outline`: Less prominent actions
- `ghost`: Subtle actions

**Sizes:**
- `sm`: Small buttons
- `md`: Default size
- `lg`: Large buttons

### Card Component

**Why**: Consistent container styling with elevation

**Features:**
- Padding variants
- Hover effects (optional)
- Shadow system
- Border radius

### Input Component

**Why**: Consistent form inputs with error handling

**Features:**
- Label support
- Error messages
- Accessibility (ARIA)
- Focus states

### PageContainer Component

**Why**: Consistent page layout

**Features:**
- Max width variants
- Responsive padding
- Centered content

### ChartCard Component

**Why**: Consistent chart containers

**Features:**
- Title and description
- Responsive chart area
- Card styling

## Role-Aware Dashboards

### Admin Dashboard

**Charts:**
- Employee count by department (Bar)
- Attendance trend (Line)

**Why**: System-wide overview for administrators

### HR Dashboard

**Charts:**
- Leave status distribution (Pie)
- Recruitment pipeline (Bar)

**Why**: HR-specific metrics for human resources team

### Employee Dashboard

**Charts:**
- Monthly attendance (Area)
- Leave balance (Line)

**Why**: Personal metrics for individual employees

## Trade-offs & Alternatives

### styled-components vs CSS Modules

**styled-components (Chosen):**
- ✅ Theme integration
- ✅ Dynamic styling
- ✅ Component scoping
- ❌ Runtime CSS generation

**CSS Modules (Alternative):**
- ✅ Standard CSS
- ✅ No runtime overhead
- ❌ No theme integration
- ❌ Less dynamic

**Decision**: styled-components chosen for theme and dynamic styling

### CSS Variables vs JS Theme Only

**CSS Variables (Chosen):**
- ✅ Browser-native
- ✅ Works with CSS
- ✅ Better performance
- ✅ Runtime theming

**JS Theme Only (Alternative):**
- ✅ Type safety
- ❌ Requires JS
- ❌ Doesn't work with CSS
- ❌ Slower

**Decision**: Both used - CSS variables for performance, JS theme for TypeScript

### Recharts vs Other Libraries

**Recharts (Chosen):**
- ✅ React-native
- ✅ Accessibility
- ✅ Responsive
- ✅ TypeScript support

**Chart.js (Alternative):**
- ✅ More features
- ❌ Not React-native
- ❌ More complex

**Decision**: Recharts chosen for React integration

### Component Library vs Custom

**Custom Components (Chosen):**
- ✅ Full control
- ✅ No dependencies
- ✅ Customizable
- ❌ More development time

**Component Library (Alternative):**
- ✅ Faster development
- ✅ Pre-built components
- ❌ Less control
- ❌ Bundle size

**Decision**: Custom components chosen for full control and customization

## Usage Examples

### Using Button

```typescript
import { Button } from '@/shared/components/Button';

<Button variant="primary" size="md">
  Click Me
</Button>
```

### Using Card

```typescript
import { Card } from '@/shared/components/Card';

<Card padding="lg" hover>
  Card content
</Card>
```

### Using Input

```typescript
import { Input } from '@/shared/components/Input';

<Input
  label="Email"
  type="email"
  error={errors.email}
  required
/>
```

### Using Charts

```typescript
import { ChartCard } from '@/shared/components/ChartCard';
import { BarChart, Bar, ... } from 'recharts';

<ChartCard title="Employees" description="By department">
  <ResponsiveContainer>
    <BarChart data={data}>
      <Bar dataKey="count" />
    </BarChart>
  </ResponsiveContainer>
</ChartCard>
```

## Best Practices

### 1. Always Use Design Tokens

**Don't:**
```typescript
color: #2563eb; // Hardcoded
```

**Do:**
```typescript
color: var(--color-primary); // Token
```

### 2. Use Styled Components for Dynamic Styles

**Don't:**
```typescript
<div style={{ color: isActive ? 'blue' : 'gray' }}>
```

**Do:**
```typescript
const StyledDiv = styled.div`
  color: ${props => props.isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)'};
`;
```

### 3. Keep Components Focused

**Don't**: One component doing everything

**Do**: Small, focused components

### 4. Accessibility First

- Always include ARIA labels
- Keyboard navigation
- Screen reader support
- Focus states

## Summary

### Key Features

✅ styled-components for CSS-in-JS  
✅ CSS variables for design tokens  
✅ TypeScript theme for type safety  
✅ Reusable component library  
✅ Role-aware dashboards  
✅ Recharts for data visualization  
✅ Accessibility built-in  

### Design Tokens

✅ Colors (primary, secondary, semantic)  
✅ Spacing scale (xs to 3xl)  
✅ Typography system  
✅ Border radius  
✅ Shadows  
✅ Transitions  

### Components

✅ Button (4 variants, 3 sizes)  
✅ Card (with hover)  
✅ Input (with error handling)  
✅ PageContainer (responsive)  
✅ ChartCard (chart wrapper)  

### Dashboards

✅ AdminDashboard (system metrics)  
✅ HRDashboard (HR metrics)  
✅ EmployeeDashboard (personal metrics)  

---

**Last Updated**: Initial implementation  
**Maintained By**: Frontend Design Team

