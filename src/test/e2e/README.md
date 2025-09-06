# End-to-End Testing

This project is set up for E2E testing using **Playwright**.

## Setup

```bash
# Install Playwright
npm install -D @playwright/test

# Install browsers
npx playwright install
```

## Configuration

Create `playwright.config.ts`:

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/test/e2e',
  use: {
    baseURL: 'http://localhost:8080',
  },
});
```

## Writing E2E Tests

```typescript
import { test, expect } from '@playwright/test';

test('user can create a habit', async ({ page }) => {
  await page.goto('/');
  
  // Click add habit button
  await page.click('text=Adicionar Hábito');
  
  // Fill form
  await page.fill('[placeholder="Ex: Ler 10 páginas"]', 'Test Habit');
  await page.selectOption('select', 'Saúde');
  
  // Submit
  await page.click('text=Salvar');
  
  // Verify habit appears
  await expect(page.locator('text=Test Habit')).toBeVisible();
});
```

## Running E2E Tests

```bash
# Run all E2E tests
npx playwright test

# Run in headed mode (see browser)
npx playwright test --headed

# Run specific test
npx playwright test habit-creation.spec.ts

# Generate test report
npx playwright show-report
```

## Best Practices

1. **Use descriptive test names**
2. **Test complete user journeys**
3. **Mock external APIs when possible**
4. **Use data-testid attributes for reliable selectors**
5. **Clean up test data**
6. **Run tests in CI/CD pipeline**

## Test Structure

```
src/test/e2e/
├── habit-management.spec.ts
├── user-authentication.spec.ts
├── finance-tracking.spec.ts
└── insights-analytics.spec.ts
```

## CI/CD Integration

Add to your GitHub Actions workflow:

```yaml
- name: Run E2E tests
  run: npx playwright test
  env:
    CI: true