import { test, expect } from '@playwright/test';

test('download hover and press move the icon and label together', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('#root')).toHaveAttribute('data-hydrated', 'true');
  const button = page.locator('.platform-download').first();
  await button.scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('.download-panel').evaluate(el => el.getAnimations().length)).toBe(0);
  const alignment = () => button.evaluate(el => {
    const icon = el.querySelector('svg')!.getBoundingClientRect();
    const label = [...el.childNodes].find(node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim())!;
    const range = document.createRange();
    range.selectNode(label);
    const text = range.getBoundingClientRect();
    return (icon.y + icon.height / 2) - (text.y + text.height / 2);
  });
  const before = await alignment();
  await button.hover();
  await expect(button).not.toHaveAttribute('title');
  await expect(button).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, -2)');
  expect(await alignment()).toBeCloseTo(before, 1);
  await expect(button.locator('svg')).toHaveCSS('transform', 'none');
  await page.mouse.down();
  await expect(button).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 1)');
  expect(await alignment()).toBeCloseTo(before, 1);
  // Release away from the link so this interaction check does not download an installer.
  await page.mouse.move(0, 0);
  await page.mouse.up();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await button.hover();
  await expect(button).toHaveCSS('transform', 'none');
});
