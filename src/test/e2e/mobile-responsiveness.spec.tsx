/// <reference types="@testing-library/jest-dom" />
/// <reference types="vitest" />
import { test, expect } from '@playwright/test';

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE size

  test.beforeEach(async ({ page }) => {
    // Sign in
    await page.goto('/login');
    await page.fill('[type="email"]', 'test@example.com');
    await page.fill('[type="password"]', 'password123');
    await page.click('text=Sign In');
    await page.waitForURL('/');
  });

  test('dashboard is responsive on mobile', async ({ page }) => {
    await page.goto('/');
    
    // Check main elements are visible
    await expect(page.locator('text=Meu Painel de Controle')).toBeVisible();
    await expect(page.locator('text=Total de Hábitos')).toBeVisible();
    
    // Check navigation works
    await page.click('[aria-label="menu"]'); // Assuming hamburger menu
    await expect(page.locator('text=Adicionar Hábito')).toBeVisible();
  });

  test('habit creation works on mobile', async ({ page }) => {
    await page.goto('/');
    
    // Click add habit button
    await page.click('text=Adicionar Hábito');
    
    // Dialog should be responsive
    await page.waitForSelector('[role="dialog"]');
    
    // Fill form
    await page.fill('[placeholder="Ex: Ler 10 páginas"]', 'Mobile Test Habit');
    await page.selectOption('select', 'Saúde');
    
    // Submit
    await page.click('text=Salvar');
    
    // Verify on mobile screen
    await expect(page.locator('text=Mobile Test Habit')).toBeVisible();
  });

  test('finance page is mobile-friendly', async ({ page }) => {
    await page.goto('/finance');
    
    // Check tabs are accessible
    await expect(page.locator('text=Transações')).toBeVisible();
    await expect(page.locator('text=Orçamentos')).toBeVisible();
    
    // Switch tabs
    await page.click('text=Orçamentos');
    await expect(page.locator('text=Orçamentos do Mês')).toBeVisible();
  });

  test('insights page works on mobile', async ({ page }) => {
    await page.goto('/insights');
    
    // Check summary cards are visible
    await expect(page.locator('text=Taxa Média de Conclusão')).toBeVisible();
    
    // Scroll to see individual insights
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.locator('text=Análise Individual')).toBeVisible();
  });

  test('calendar is touch-friendly on mobile', async ({ page }) => {
    await page.goto('/calendar');
    
    // Calendar should be visible and touchable
    const calendar = page.locator('[role="grid"]');
    await expect(calendar).toBeVisible();
    
    // Try tapping a date
    const firstDay = page.locator('[role="gridcell"]').first();
    await firstDay.tap();
    
    // Should be able to interact
    await expect(page.locator('text=Calendário de Progresso')).toBeVisible();
  });

  test('notifications work on mobile', async ({ page }) => {
    await page.goto('/notifications');
    
    // Check tabs
    await expect(page.locator('text=Centro de Notificações')).toBeVisible();
    
    // Switch to settings
    await page.click('text=Configurações');
    await expect(page.locator('text=Configurações Gerais')).toBeVisible();
  });
});