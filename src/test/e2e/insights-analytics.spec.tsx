/// <reference types="@testing-library/jest-dom" />
/// <reference types="vitest" />
import { test, expect } from '@playwright/test';

test.describe('Insights and Analytics', () => {
  test.beforeEach(async ({ page }) => {
    // Sign in
    await page.goto('/login');
    await page.fill('[type="email"]', 'test@example.com');
    await page.fill('[type="password"]', 'password123');
    await page.click('text=Sign In');
    await page.waitForURL('/');
  });

  test('user can access insights page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=📊 Insights');
    
    await expect(page.locator('text=Análise de Performance')).toBeVisible();
  });

  test('insights summary is displayed', async ({ page }) => {
    await page.goto('/insights');
    
    // Check for summary cards
    await expect(page.locator('text=Taxa Média de Conclusão')).toBeVisible();
    await expect(page.locator('text=Sequência Média Atual')).toBeVisible();
    await expect(page.locator('text=Hábitos Melhorando')).toBeVisible();
  });

  test('individual habit insights are shown', async ({ page }) => {
    await page.goto('/insights');
    
    // Should show individual habit cards
    await expect(page.locator('text=Taxa de Conclusão')).toBeVisible();
    await expect(page.locator('text=Sequência Atual')).toBeVisible();
  });

  test('user can access notifications page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=🔔 Notificações');
    
    await expect(page.locator('text=Centro de Notificações')).toBeVisible();
  });

  test('user can view notification history', async ({ page }) => {
    await page.goto('/notifications');
    
    // Should show notification center
    await expect(page.locator('text=Centro de Notificações')).toBeVisible();
  });

  test('user can configure notification settings', async ({ page }) => {
    await page.goto('/notifications');
    await page.click('text=Configurações');
    
    // Should show settings options
    await expect(page.locator('text=Notificações ativadas')).toBeVisible();
    await expect(page.locator('text=Lembretes de hábitos')).toBeVisible();
  });

  test('user can access calendar view', async ({ page }) => {
    await page.goto('/');
    await page.click('text=📅 Calendário');
    
    await expect(page.locator('text=Calendário de Hábitos')).toBeVisible();
  });

  test('calendar shows habit completion data', async ({ page }) => {
    await page.goto('/calendar');
    
    // Should show calendar grid
    await expect(page.locator('[role="grid"]')).toBeVisible();
  });

  test('user can filter calendar by habit', async ({ page }) => {
    await page.goto('/calendar');
    
    // Should have habit filter dropdown
    const select = page.locator('select').first();
    await expect(select).toBeVisible();
  });

  test('monthly statistics are displayed', async ({ page }) => {
    await page.goto('/calendar');
    
    // Should show stats cards
    await expect(page.locator('text=Total de Conclusões')).toBeVisible();
    await expect(page.locator('text=Dias Ativos')).toBeInTheDocument();
  });
});