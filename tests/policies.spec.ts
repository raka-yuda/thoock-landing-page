import { test, expect } from '@playwright/test';

const production = 'http://127.0.0.1:4173';

test('refund policy is public without JavaScript and linked from the homepage', async ({ browser }) => {
  const page = await browser.newPage({ javaScriptEnabled: false });
  await page.goto(`${production}/`);
  await page.getByRole('navigation', { name: 'Policies and support' }).getByRole('link', { name: 'Refund Policy' }).click();
  await expect(page).toHaveURL(`${production}/refund-policy/`);
  await expect(page).toHaveTitle('Refund Policy | Thoock');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Refund Policy');
  await expect(page.locator('.policy-content')).toContainText('seven calendar days of successful payment');
  await expect(page.locator('.policy-content')).toContainText('preserves its eligibility');
  await expect(page.locator('.policy-content')).toContainText('not reimbursed by Thoock');
  await expect(page.locator('.policy-content a').first()).toHaveAttribute('href', 'mailto:help@thoock.ryuda.me');
  await page.close();
});

test('refund route redirects correctly and hydrates without overflow in both themes', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const theme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${production}/refund-policy`);
      await expect(page).toHaveURL(`${production}/refund-policy/`);
      await expect(page.locator('#root')).toHaveAttribute('data-hydrated', 'true');
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Refund Policy');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
  expect(errors).toEqual([]);
});

for (const [path, heading] of [['/terms/', 'Terms & Conditions'], ['/privacy/', 'Privacy Policy']]) {
  test(`${heading} is public, linked and responsive`, async ({ browser }) => {
    const page = await browser.newPage({ javaScriptEnabled: false });
    await page.goto(`${production}/`);
    await page.getByRole('navigation', { name: 'Policies and support' }).getByRole('link', { name: heading, exact: true }).click();
    await expect(page).toHaveURL(`${production}${path}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    await page.close();
    const interactive = await browser.newPage({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    interactive.on('pageerror', error => errors.push(error.message));
    for (const colorScheme of ['light', 'dark'] as const) {
      await interactive.emulateMedia({ colorScheme });
      for (const width of [320, 1440]) {
        await interactive.setViewportSize({ width, height: 900 });
        await interactive.goto(`${production}${path.slice(0, -1)}`);
        await expect(interactive).toHaveURL(`${production}${path}`);
        await expect(interactive.locator('#root')).toHaveAttribute('data-hydrated', 'true');
        await expect(interactive).toHaveTitle(`${heading} | Thoock`);
        expect(await interactive.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      }
    }
    expect(errors).toEqual([]);
    await interactive.close();
  });
}
