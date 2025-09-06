import { test, expect } from '@playwright/test';

test.describe('Habit Management', () => {
  test.beforeEach(async ({ page }) => {
    // Assuming you have a test user setup
    await page.goto('/login');
    await page.fill('[type="email"]', 'test@example.com');
    await page.fill('[type="password"]', 'password');
    await page.click('button:has-text("Sign in")');
    await page.waitForURL('/');
  });

  test('user can create a new habit', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Adicionar Hábito")');
    await page.waitForSelector('[role="dialog"]');
    await page.click('button[role="tab"]:has-text("Personalizado")');
    
    await page.fill('input[placeholder="Ex: Ler 10 páginas"]', 'Test Habit from E2E');
    await page.fill('textarea[placeholder="Ex: Ler um livro de ficção por 15 minutos."]', 'Test description');
    
    await page.click('[role="combobox"]');
    await page.click('[role="option"]:has-text("Saúde")');
    
    await page.click('button:has-text("Salvar")');
    
    await expect(page.locator('text=Test Habit from E2E')).toBeVisible();
    await expect(page.locator('text=Test description')).toBeVisible();
  });

  test('user can mark habit as completed', async ({ page }) => {
    await page.goto('/');
    
    const checkbox = page.locator('label:has-text("Feito hoje")').first();
    await checkbox.click();
    
    await expect(checkbox.locator('~ button[role="checkbox"]')).toBeChecked();
  });

  test('user can edit a habit', async ({ page }) => {
    await page.goto('/');
    
    await page.click('text=Test Habit from E2E');
    await page.waitForURL(/\/habit\//);

    await page.click('button:has-text("Editar Hábito")');
    await page.waitForSelector('[role="dialog"]');
    
    const nameInput = page.locator('input[placeholder="Ex: Ler 10 páginas"]');
    await nameInput.fill('Updated Habit Name');
    
    await page.click('button:has-text("Salvar Alterações")');
    
    await expect(page.locator('h2:text("Updated Habit Name")')).toBeVisible();
  });

  test('user can delete a habit', async ({ page }) => {
    await page.goto('/');
    
    await page.locator('button[aria-label*="Excluir hábito"]').first().click();
    
    await page.click('button:has-text("Excluir")');
    
    await expect(page.locator('text=Updated Habit Name')).not.toBeVisible();
  });
});