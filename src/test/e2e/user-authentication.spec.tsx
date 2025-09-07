import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {
  test('user can sign up for a new account', async ({ page }) => {
    await page.goto('/login');
    
    // Go to sign up page
    await page.click('text=Sign up');
    
    // Fill out sign up form
    const email = `test-user-${Date.now()}@example.com`;
    await page.fill('[type="email"]', email);
    await page.fill('[type="password"]', 'password123');
    
    // Submit
    await page.click('button:has-text("Sign up")');
    
    // Should show a confirmation message or redirect
    // This depends on your app's flow (e.g., email confirmation)
    // For now, we'll check for a redirect to the dashboard
    await page.waitForURL('/');
    await expect(page.locator('text=Meu Painel de Controle')).toBeVisible();
  });

  test('user can sign in with existing credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill out sign in form
    await page.fill('[type="email"]', 'test@example.com'); // Assuming this user exists
    await page.fill('[type="password"]', 'password123');
    
    // Submit
    await page.click('button:has-text("Sign in")');
    
    // Should redirect to dashboard
    await page.waitForURL('/');
    await expect(page.locator('text=Meu Painel de Controle')).toBeVisible();
  });

  test('user is redirected to login when accessing protected route', async ({ page }) => {
    // Try to access a protected route without being logged in
    await page.goto('/insights');
    
    // Should be redirected to login page
    await page.waitForURL('/login');
    await expect(page.locator('text=Sign In')).toBeVisible();
  });

  test('user can sign out', async ({ page }) => {
    // First, sign in
    await page.goto('/login');
    await page.fill('[type="email"]', 'test@example.com');
    await page.fill('[type="password"]', 'password123');
    await page.click('button:has-text("Sign in")');
    await page.waitForURL('/');
    
    // Now, sign out
    // This assumes a "Sair" (Sign Out) button is available in the UI
    await page.click('text=Sair');
    
    // Should be redirected to login page
    await page.waitForURL('/login');
    await expect(page.locator('text=Sign In')).toBeVisible();
  });

  test('shows error on invalid login', async ({ page }) => {
    await page.goto('/login');
    
    // Fill with invalid credentials
    await page.fill('[type="email"]', 'wrong@example.com');
    await page.fill('[type="password"]', 'wrongpassword');
    
    // Submit
    await page.click('button:has-text("Sign in")');
    
    // Should show an error message
    // The exact text depends on the auth provider's response
    await expect(page.locator('[role="alert"]')).toBeVisible();
  });
});