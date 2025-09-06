/// <reference types="@testing-library/jest-dom" />
/// <reference types="vitest" />
import { test, expect } from '@playwright/test';

test.describe('Finance Tracking', () => {
  test.beforeEach(async ({ page }) => {
    // Sign in
    await page.goto('/login');
    await page.fill('[type="email"]', 'test@example.com');
    await page.fill('[type="password"]', 'password123');
    await page.click('text=Sign In');
    await page.waitForURL('/');
  });

  test('user can navigate to finance page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Finanças');
    
    await expect(page.locator('text=Controle Financeiro')).toBeVisible();
  });

  test('user can add a transaction', async ({ page }) => {
    await page.goto('/finance');
    
    // Click add transaction button
    await page.click('text=Adicionar Transação');
    
    // Fill transaction form
    await page.fill('[placeholder="Ex: Café da manhã, Salário"]', 'Test Transaction');
    await page.fill('[placeholder="Ex: 15.50"]', '25.50');
    await page.check('[value="expense"]'); // Select expense
    await page.selectOption('select', 'Alimentação');
    
    // Submit
    await page.click('text=Salvar');
    
    // Verify transaction appears
    await expect(page.locator('text=Test Transaction')).toBeVisible();
    await expect(page.locator('text=R$ 25.50')).toBeVisible();
  });

  test('user can add a budget', async ({ page }) => {
    await page.goto('/finance');
    
    // Switch to budgets tab
    await page.click('text=Orçamentos');
    
    // Click add budget button
    await page.click('text=Adicionar Orçamento');
    
    // Fill budget form
    await page.fill('[placeholder="Ex: Alimentação, Transporte"]', 'Test Budget');
    await page.fill('[placeholder="Ex: 500.00"]', '300.00');
    
    // Submit
    await page.click('text=Salvar');
    
    // Verify budget appears
    await expect(page.locator('text=Test Budget')).toBeVisible();
  });

  test('user can view expense chart', async ({ page }) => {
    await page.goto('/finance');
    
    // Switch to analysis tab
    await page.click('text=Análise');
    
    // Should see expense chart
    await expect(page.locator('text=Despesas por Categoria')).toBeVisible();
  });

  test('user can export transactions', async ({ page }) => {
    await page.goto('/finance');
    
    // Click export button
    const downloadPromise = page.waitForEvent('download');
    await page.click('text=Exportar CSV');
    
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('transacoes');
  });

  test('budget progress is displayed correctly', async ({ page }) => {
    await page.goto('/finance');
    await page.click('text=Orçamentos');
    
    // Assuming there's a budget with some expenses
    const progressBar = page.locator('[role="progressbar"]').first();
    await expect(progressBar).toBeVisible();
    
    // Check if spent amount is displayed
    await expect(page.locator('text=R$')).toBeVisible();
  });
});