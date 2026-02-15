# Testing Guide

## Overview

This project uses Jest and React Testing Library for comprehensive testing of components and integration tests.

## Test Structure

```
__tests__/
  ├── integration/          # Integration tests
  │   ├── app.integration.test.tsx
  │   └── routing.integration.test.tsx
  └── unit/                # Unit tests for utilities
      └── utils.test.ts

components/
  ├── __tests__/           # Component unit tests
  │   ├── Header.test.tsx
  │   └── TabNavigation.test.tsx
  └── tabs/
      └── __tests__/
          └── FrameworkTab.test.tsx

app/
  └── __tests__/           # Page tests
      └── page.test.tsx
```

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

### Specific Test File
```bash
npm test Header.test.tsx
```

### In Docker
```bash
docker-compose exec app npm test
```

## Test Coverage

### Unit Tests
- ✅ Header component
- ✅ TabNavigation component
- ✅ FrameworkTab component
- ✅ Home page component
- ✅ Utility functions

### Integration Tests
- ✅ Application structure
- ✅ Tab navigation flow
- ✅ State management
- ✅ Routing structure

## Writing Tests

### Component Test Example

```typescript
import { render, screen } from '@testing-library/react'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

### Integration Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import Home from '@/app/page'

describe('Integration Test', () => {
  it('handles user interactions', () => {
    render(<Home />)
    const button = screen.getByText('Click Me')
    fireEvent.click(button)
    expect(screen.getByText('Result')).toBeInTheDocument()
  })
})
```

## Best Practices

1. **Test user behavior, not implementation**
   - Test what users see and interact with
   - Avoid testing internal state directly

2. **Use semantic queries**
   - Prefer `getByRole`, `getByLabelText`, `getByText`
   - Avoid `getByTestId` unless necessary

3. **Keep tests isolated**
   - Each test should be independent
   - Use `beforeEach` for setup, not shared state

4. **Test accessibility**
   - Check for ARIA attributes
   - Verify keyboard navigation

5. **Mock external dependencies**
   - Mock API calls
   - Mock Next.js router if needed

## CI/CD Integration

Tests run automatically on:
- Push to main/dev/stage branches
- Pull requests
- Multiple Node.js versions (18.x, 20.x)

See `.github/workflows/test.yml` for configuration.

## Coverage Goals

- **Target**: 80%+ coverage
- **Critical paths**: 100% coverage
- **Components**: 90%+ coverage

## Troubleshooting

### Tests failing with module not found
```bash
npm install
```

### Tests failing with TypeScript errors
```bash
npm run build
```

### Coverage not generating
```bash
rm -rf .next coverage
npm run test:coverage
```

