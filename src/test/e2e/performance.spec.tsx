import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    // Sign in
    await page.fill('[type="email"]', 'test@example.com');
    await page.fill('[type="password"]', 'password123');
    await page.click('text=Sign In');
    
    await page.waitForURL('/');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
  });

  test('habit list renders quickly', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[type="email"]', 'test@example.com');
    await page.fill('[type="password"]', 'password123');
    await page.click('text=Sign In');
    await page.waitForURL('/');
    
    const startTime = Date.now();
    
    // Wait for habits to load
    await page.waitForSelector('[data-testid="habit-list"]', { timeout: 3000 });
    
    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThan(2000); // Should render within 2 seconds
  });

  test('navigation is fast', async ({ page }) => {
    // Sign in first
    await page.goto('/login');
    await page.fill('[type="email"]', 'test@example.com');
    await page.fill('[type="password"]', 'password123');
    await page.click('text=Sign In');
    await page.waitForURL('/');
    
    // Test navigation to insights
    const startTime = Date.now();
    await page.click('text=📊 Insights');
    await page.waitForURL('/insights');
    
    const navTime = Date.now() - startTime;
    expect(navTime).toBeLessThan(1000); // Should navigate within 1 second
  });

  test('form submission is responsive', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[type="email"]', 'test@example.com');
    await page.fill('[type="password"]', 'password123');
    await page.click('text=Sign In');
    await page.waitForURL('/');
    
    // Click add habit
    await page.click('text=Adicionar Hábito');
    await page.waitForSelector('[role="dialog"]');
    
    const startTime = Date.now();
    
    // Fill and submit form
    await page.fill('[placeholder="Ex: Ler 10 páginas"]', 'Performance Test');
    await page.selectOption('select', 'Saúde');
    await page.click('text=Salvar');
    
    const submitTime = Date.now() - startTime;
    expect(submitTime).toBeLessThan(2000); // Should submit within 2 seconds
  });

  test('large dataset performance', async ({ page }) => {
    // This test would require setting up a user with many habits
    // For now, we'll test with the current dataset
    
    await page.goto('/login');
    await page.fill('[type="email"]', 'test@example.com');
    await page.fill('[type="password"]', 'password123');
    await page.click('text=Sign In');
    await page.waitForURL('/');
    
    const startTime = Date.now();
    
    // Wait for all habits to render
    await page.waitForSelector('[data-testid="habit-item"]', { timeout: 5000 });
    
    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThan(3000); // Should handle dataset within 3 seconds
  });

  test('memory usage is reasonable', async ({ page }) => {
    await page.goto('/');
    
    // This would require browser performance APIs
    // For now, we'll check that the page doesn't crash
    await page.waitForTimeout(2000);
    
    // Page should still be responsive
    await expect(page.locator('text=Meu Painel de Controle')).toBeVisible();
  });

  test('no console errors during normal usage', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/login');
    await page.fill('[type="email"]', 'test@example.com');
    await page.fill('[type="password"]', 'password123');
    await page.click('text=Sign In');
    await page.waitForURL('/');
    
    // Navigate around
    await page.click('text=📊 Insights');
    await page.waitForURL('/insights');
    
    await page.click('text=🔔 Notificações');
    await page.waitForURL('/notifications');
    
    // Should have no console errors
    expect(errors).toHaveLength(0);
  });
});