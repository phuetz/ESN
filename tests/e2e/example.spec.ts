import { test, expect } from '@playwright/test';

test.describe('ESN Manager Pro', () => {
  test('should display the application title', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('text=ESN Manager Pro')).toBeVisible();
  });

  test('should navigate between modules', async ({ page }) => {
    await page.goto('/');

    // Click on Clients module
    await page.click('text=Clients');
    await expect(page.locator('text=Gestion des clients')).toBeVisible();

    // Click on Consultants module
    await page.click('text=Consultants');
    await expect(page.locator('text=Gestion des consultants')).toBeVisible();
  });

  test('should open notifications dropdown', async ({ page }) => {
    await page.goto('/');

    // Click on notifications bell
    const notificationButton = page.locator('[title*="Notification"]').or(page.locator('svg').filter({ has: page.locator('[name="bell"]') }).locator('..'));
    await notificationButton.click();

    await expect(page.locator('text=Notifications')).toBeVisible();
  });

  test('should search functionality', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[placeholder*="Rechercher"]');
    await searchInput.fill('test');

    await expect(searchInput).toHaveValue('test');
  });
});
