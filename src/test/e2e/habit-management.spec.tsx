import { test, expect } from '@playwright/test';

test.describe('Habit Management', () => {
  test.beforeEach(async ({ page }) => {
    // Assuming you have a test user setup
    await page.goto('/login');
    await page.fill('[type="email"]', 'test@example.com');
    await page.fill('[type="password"]', 'password');
    await page.click('text=Sign In');
    await page.waitForURL('/');
  });

  test('user can create a new habit', async ({ page }) => {
    // Navigate to main page
    await page.goto('/');
    
    // Click add habit button
    await page.click('text=Adicionar Hábito');
    
    // Wait for dialog to open
    await page.waitForSelector('[role="dialog"]');
    
    // Switch to custom tab
    await page.click('text=Personalizado');
    
    // Fill out the form
    await page.fill('[placeholder="Ex: Ler 10 páginas"]', 'Test Habit');
    await page.fill('[placeholder="Ex: Ler um livro de ficção por 15 minutos."]', 'Test description');
    await page.selectOption('select', 'Saúde');
    
    // Submit the form
    await page.click('text=Salvar');
    
    // Verify habit appears in the list
    await expect(page.locator('text=Test Habit')).toBeVisible();
    await expect(page.locator('text=Test description')).toBeVisible();
  });

  test('user can mark habit as completed', async ({ page }) => {
    // Assuming there's already a habit created
    await page.goto('/');
    
    // Find the checkbox for the first habit
    const checkbox = page.locator('[type="checkbox"]').first();
    
    // Mark as completed
    await checkbox.check();
    
    // Verify it's checked
    await expect(checkbox).toBeChecked();
    
    // Check if confetti appears (if all habits are completed)
    const confetti = page.locator('[data-testid="confetti"]');
    // This might not appear if there are multiple habits
    // await expect(confetti).toBeVisible();
  });

  test('user can delete a habit', async ({ page }) => {
    await page.goto('/');
    
    // Click the delete button (trash icon)
    const deleteButton = page.locator('[aria-label*="excluir"]').first();
    await deleteButton.click();
    
    // Confirm deletion in alert dialog
    await page.click('text=Excluir');
    
    // Verify habit is removed
    await expect(page.locator('text=Test Habit')).not.toBeVisible();
  });

  test('user can edit a habit', async ({ page }) => {
    await page.goto('/');
    
    // Click edit button
    const editButton = page.locator('text=Editar Hábito').first();
    await editButton.click();
    
    // Wait for dialog
    await page.waitForSelector('[role="dialog"]');
    
    // Update habit name
    const nameInput = page.locator('[placeholder="Ex: Ler 10 páginas"]');
    await nameInput.fill('Updated Habit Name');
    
    // Save changes
    await page.click('text=Salvar Alterações');
    
    // Verify update
    await expect(page.locator('text=Updated Habit Name')).toBeVisible();
  });

  test('habit completion persists across page reloads', async ({ page }) => {
    await page.goto('/');
    
    // Mark habit as completed
    const checkbox = page.locator('[type="checkbox"]').first();
    await checkbox.check();
    
    // Reload page
    await page.reload();
    
    // Verify habit is still marked as completed
    await expect(checkbox).toBeChecked();
  });
});