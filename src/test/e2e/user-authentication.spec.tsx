import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {
  test('user can sign up', async ({ page }) => {
    await page.goto('/login');
    
    // Click sign up link/button
    await page.click('text=Sign Up');
    
    // Fill registration form
    await page.fill('[type="email"]', 'newuser@example.com');
    await page.fill('[type="password"]', 'password123');
    await page.fill('[placeholder*="confirm"]', 'password123');
    
    // Submit
    await page.click('text=Sign Up');
    
    // Should redirect to dashboard
    await page.waitForURL('/');
    await expect(page.locator('text=Meu Painel de Controle')).toBeVisible();
  });

  test('user can sign in', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form
    await page.fill('[type="email"]', 'test@example.com');
    await page.fill('[type="password"]', 'password123');
    
    // Submit
    await page.click('text=Sign In');
    
    // Should redirect to dashboard
    await page.waitForURL('/');
    await expect(page.locator('text=Meu Painel de Controle')).toBeVisible();
  });

  test('user sees error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill with invalid credentials
    await page.fill('[type="email"]', 'invalid@example.com');
    await page.fill('[type="password"]', 'wrongpassword');
    
    // Submit
    await page.click('text=Sign In');
    
    // Should see error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });

  test('user can sign out', async ({ page }) => {
    // Sign in first
    await page.goto('/login');
    await page.fill('[type="email"]', 'test@example.com');
    await page.fill('[type="password"]', 'password123');
    await page.click('text=Sign In');
    await page.waitForURL('/');
    
    // Click sign out
    await page.click('text=Sair');
    
    // Should redirect to login
    await page.waitForURL('/login');
    await expect(page.locator('text=Sign In')).toBeVisible();
  });

  test('authenticated user cannot access login page', async ({ page }) => {
    // Sign in first
    await page.goto('/login');
    await page.fill('[type="email"]', 'test@example.com');
    await page.fill('[type="password"]', 'password123');
    await page.click('text=Sign In');
    await page.waitForURL('/');
    
    // Try to access login page
    await page.goto('/login');
    
    // Should redirect to dashboard
    await expect(page.url()).toBe('http://localhost:8080/');
  });
});