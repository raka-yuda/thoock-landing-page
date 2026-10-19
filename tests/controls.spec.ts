import { test, expect } from '@playwright/test';

test('download hover leaves the icon, label, and button in place', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#root')).toHaveAttribute('data-hydrated', 'true');
  const button = page.locator('.platform-download').first();
  await button.scrollIntoViewIfNeeded();
  // Let the one-time section entrance finish before measuring hover.
  await expect.poll(() => page.locator('.download-panel').evaluate(el => el.getAnimations().length)).toBe(0);
  const before = await button.boundingBox();
  await button.hover();
  await expect(button).not.toHaveAttribute('title');
  await expect.poll(() => button.locator('svg').evaluate(el => getComputedStyle(el).transform)).toBe('none');
  const after = await button.boundingBox();
  expect(after!.x).toBeCloseTo(before!.x, 0);
  expect(after!.y).toBeCloseTo(before!.y, 0);
});
