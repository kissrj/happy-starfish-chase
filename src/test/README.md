# Testing Guide

This project uses **Vitest** for unit testing and **React Testing Library** for component testing.

## Setup

All testing dependencies are already installed. The test configuration is set up in:
- `vitest.config.ts` - Vitest configuration
- `src/test/setup.ts` - Test environment setup
- `src/test/utils.tsx` - Test utilities and helpers

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test Button.test.tsx
```

## Test Structure

```
src/
├── components/
│   └── __tests__/          # Component tests
│       ├── Button.test.tsx
│       └── ...
├── hooks/
│   └── __tests__/          # Hook tests
│       ├── useHabits.test.tsx
│       └── ...
└── test/
    ├── setup.ts           # Test setup
    ├── utils.tsx          # Test utilities
    └── README.md          # This file
```

## Writing Tests

### Component Tests
```tsx
import { render, screen } from '@/test/utils';
import { describe, it, expect } from 'vitest';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Hook Tests
```tsx
import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useMyHook } from '@/hooks/useMyHook';

describe('useMyHook', () => {
  it('returns correct initial state', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.state).toBe('initial');
  });
});
```

## Test Utilities

### Custom Render
Use the custom render function that includes all necessary providers:

```tsx
import { render } from '@/test/utils';
```

### Mock Data Generators
```tsx
import { createMockHabit, createMockUser } from '@/test/utils';

const mockHabit = createMockHabit({ name: 'Test Habit' });
```

### Async Testing
```tsx
import { waitFor } from '@testing-library/react';

await waitFor(() => {
  expect(result.current.loading).toBe(false);
});
```

## Best Practices

1. **Test user interactions, not implementation details**
2. **Use descriptive test names**
3. **Group related tests with `describe` blocks**
4. **Mock external dependencies**
5. **Test error states and edge cases**
6. **Keep tests fast and isolated**

## Coverage Goals

- **Components**: 80%+ coverage
- **Hooks**: 90%+ coverage
- **Utilities**: 95%+ coverage

Run `npm run test:coverage` to check current coverage.