/// <reference types="@testing-library/jest-dom" />
/// <reference types="vitest" />
import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('application loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Should either show login or dashboard
    const loginVisible = await page.locator('text=Sign In').isVisible();
    const dashboardVisible = await page.locator('text=Meu Painel de Controle').isVisible();
    
    expect(loginVisible || dashboardVisible).toBe(true);
  });

  test('user can navigate between main pages', async ({ page }) => {
    // Sign in first
    await page.goto('/login');
    await page.fill('[type="email"]', 'test@example.com');
    await page.fill('[type="password"]', 'password123');
    await page.click('text=Sign In');
    await page.waitForURL('/');
    
    // Test navigation to each main page
    const pages = [
      { link: '📊 Insights', url: '/insights', title: 'Análise de Performance' },
      { link: '🔔 Notificações', url: '/notifications', title: 'Centro de Notificações' },
      { link: 'Finanças', url: '/finance', title: 'Controle Financeiro' },
      { link: 'Perfil', url: '/profile', title: 'Seu Perfil' },
      { link: 'Configurações', url: '/settings', title: 'Configurações' },
    ];
    
    for (const pageData of pages) {
      await page.click(`text=${pageData.link}`);
      await page.waitForURL(pageData.url);
      await expect(page.locator(`text=${pageData.title}`)).toBeVisible();
      
      // Go back to dashboard
      await page.goto('/');
    }
  });

  test('core habit functionality works', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[type="email"]', 'test@example.com');
    await page.fill('[type="password"]', 'password123');
    await page.click('text=Sign In');
    await page.waitForURL('/');
    
    // Check if habits load
    await page.waitForSelector('[data-testid="habit-list"]', { timeout: 5000 });
    
    // Try to add a habit
    await page.click('text=Adicionar Hábito');
    await page.waitForSelector('[role="dialog"]');
    
    // Close dialog
    await page.click('[aria-label="Close"]');
    
    // Page should still work
    await expect(page.locator('text=Meu Painel de Controle')).toBeVisible();
  });

  test('responsive design works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile
    
    await page.goto('/login');
    await page.fill('[type="email"]', 'test@example.com');
    await page.fill('[type="password"]', 'password123');
    await page.click('text=Sign In');
    await page.waitForURL('/');
    
    // Main elements should be visible on mobile
    await expect(page.locator('text=Meu Painel de Controle')).toBeVisible();
  });

  test('error handling works', async ({ page }) => {
    // Try to access protected route without auth
    await page.goto('/insights');
    
    // Should redirect to login
    await page.waitForURL('/login');
    await expect(page.locator('text=Sign In')).toBeVisible();
  });

  test('forms work correctly', async ({ page }) => {
    await page.goto('/login');
    
    // Test login form
    await page.fill('[type="email"]', 'test@example.com');
    await page.fill('[type="password"]', 'password123');
    await page.click('text=Sign In');
    
    // Should navigate to dashboard
    await page.waitForURL('/');
    await expect(page.locator('text=Meu Painel de Controle')).toBeVisible();
  });

  test('data persistence works', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[type="email"]', 'test@example.com');
    await page.fill('[type="password"]', 'password123');
    await page.click('text=Sign In');
    await page.waitForURL('/');
    
    // Get initial habit count
    const initialHabits = await page.locator('[data-testid="habit-item"]').count();
    
    // Reload page
    await page.reload();
    
    // Habit count should be the same
    const reloadedHabits = await page.locator('[data-testid="habit-item"]').count();
    expect(reloadedHabits).toBe(initialHabits);
  });

  test('external links work', async ({ page }) => {
    await page.goto('/');
    
    // Check if "Made with Dyad" link exists and is clickable
    const dyadLink = page.locator('a[href*="dyad.sh"]');
    if (await dyadLink.isVisible()) {
      // Should not cause errors when clicked
      await dyadLink.click();
      // Browser should handle external link
    }
  });
});