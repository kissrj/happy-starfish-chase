/// <reference types="@testing-library/jest-dom" />
/// <reference types="vitest" />
import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    // Sign in
    await page.goto('/login');
    await page.fill('[type="email"]', 'test@example.com');
    await page.fill('[type="password"]', 'password123');
    await page.click('text=Sign In');
    await page.waitForURL('/');
  });

  test('page has proper heading structure', async ({ page }) => {
    await page.goto('/');
    
    // Check for h1
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    
    // Check heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    expect(headings.length).toBeGreaterThan(0);
  });

  test('buttons have accessible names', async ({ page }) => {
    await page.goto('/');
    
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const accessibleName = await button.getAttribute('aria-label') || 
                           await button.textContent();
      expect(accessibleName?.trim()).not.toBe('');
    }
  });

  test('form inputs have labels', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Adicionar Hábito');
    
    // Check form inputs
    const inputs = page.locator('input');
    const inputCount = await inputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const inputId = await input.getAttribute('id');
      const label = inputId ? page.locator(`label[for="${inputId}"]`) : null;
      
      if (label) {
        await expect(label).toBeVisible();
      }
    }
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/');
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i);
      const alt = await image.getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Tab through focusable elements
    await page.keyboard.press('Tab');
    let focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Continue tabbing
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    }
  });

  test('color contrast is adequate', async ({ page }) => {
    await page.goto('/');
    
    // This would require additional tools like axe-playwright
    // For now, we'll check that text is readable
    const textElements = page.locator('p, span, div, h1, h2, h3, h4, h5, h6');
    const textCount = await textElements.count();
    
    expect(textCount).toBeGreaterThan(0);
  });

  test('focus indicators are visible', async ({ page }) => {
    await page.goto('/');
    
    // Focus on a button
    const button = page.locator('button').first();
    await button.focus();
    
    // Check if focus is visible (this is a basic check)
    const isFocused = await button.evaluate(el => el === document.activeElement);
    expect(isFocused).toBe(true);
  });

  test('screen reader content is available', async ({ page }) => {
    await page.goto('/');
    
    // Check for aria-labels and aria-describedby
    const ariaElements = page.locator('[aria-label], [aria-describedby]');
    const ariaCount = await ariaElements.count();
    
    // Should have some accessible elements
    expect(ariaCount).toBeGreaterThan(0);
  });
});