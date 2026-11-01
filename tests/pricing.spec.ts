import { test, expect } from '@playwright/test';
import { createServer, type ViteDevServer } from 'vite';
import type { AddressInfo } from 'node:net';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const paymentOrigin = 'http://localhost:3000';
const product = {
  id: 'thoock-lifetime',
  name: 'Thoock Lifetime License',
  description: 'One-time purchase for the Thoock desktop app.',
  licenseTerms: { id: 'lifetime', name: 'Lifetime', entitlement: 'lifetime', durationDays: null, startsOn: 'issuance', deviceLimit: 2, offlineDays: 30, claimLimit: null, eligibilityGroup: null },
  pricing: {
    amount: 50000,
    listAmount: 150000,
    discount: 100000,
    currency: 'IDR',
    displayUsd: '$5.00',
    displayListUsd: '$15.00',
    promo: { id: '26ad776f-9f28-43bb-b310-4cb3469eaac9', code: 'EARLY20', name: 'Early access', endsAt: null, remaining: 20 },
  },
  checkoutAvailable: true,
  simulatedPayment: false,
  checkoutUrl: `${paymentOrigin}/?product=thoock-lifetime&promo=EARLY20`,
};
const trial = {
  ...product,
  id: 'thoock-trial',
  name: 'Thoock 7-day trial',
  description: 'Try Thoock for seven days from your first activation.',
  licenseTerms: { id: 'trial-7-days', name: '7-day trial', entitlement: 'trial', durationDays: 7, startsOn: 'first_activation', deviceLimit: 1, offlineDays: 7, claimLimit: 1, eligibilityGroup: 'thoock-trial' },
  pricing: { amount: 0, listAmount: 0, currency: 'IDR', displayUsd: null, promo: null },
  checkoutUrl: `${paymentOrigin}/?product=thoock-trial`,
};

let server: ViteDevServer;
let siteUrl: string;
let cacheDir: string;

test.beforeAll(async () => {
  process.env.VITE_PAYMENT_BASE_URL = paymentOrigin;
  // A second Vite server must not rewrite the main test server's optimized
  // dependency cache and trigger page reloads during unrelated browser tests.
  cacheDir = await mkdtemp(join(tmpdir(), 'thoock-pricing-vite-'));
  // Vite treats port 0 as its default 5173, already used by Playwright.
  server = await createServer({ cacheDir, server: { host: '127.0.0.1', port: 5174, strictPort: false } });
  await server.listen();
  siteUrl = `http://127.0.0.1:${(server.httpServer!.address() as AddressInfo).port}`;
});

test.afterAll(async () => {
  await server?.close();
  if (cacheDir) await rm(cacheDir, { recursive: true, force: true });
  delete process.env.VITE_PAYMENT_BASE_URL;
});

test('shows live catalog pricing and links the returned product ID to checkout', async ({ page }) => {
  await page.route(`${paymentOrigin}/api/pricing`, route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ products: [product] }) }));
  await page.goto(siteUrl);
  const card = page.locator('#pricing [data-product-id="thoock-lifetime"]');
  await expect(card).toBeVisible();
  await expect(card).toContainText('50.000');
  await expect(card).toContainText('150.000');
  await expect(card).toContainText('EARLY20');
  await expect(card).toContainText('Checkout charges IDR');
  await expect(card.getByRole('link', { name: 'Buy license' })).toHaveAttribute('href', product.checkoutUrl);
  await expect(card.getByRole('link', { name: 'Buy license' })).toHaveAttribute('data-umami-event-product', product.id);
});

test('never offers checkout when the service disables it or returns a mismatched product URL', async ({ page }) => {
  await page.route(`${paymentOrigin}/api/pricing`, route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ products: [
    { ...product, id: 'unavailable', checkoutAvailable: false, checkoutUrl: `${paymentOrigin}/?product=unavailable` },
    { ...product, id: 'other-license', checkoutUrl: `${paymentOrigin}/?product=wrong-license` },
  ] }) }));
  await page.goto(siteUrl);
  await expect(page.locator('#pricing [data-product-id]')).toHaveCount(2);
  await expect(page.locator('#pricing .pricing-buy')).toHaveCount(0);
  await expect(page.locator('#pricing .pricing-unavailable')).toHaveCount(2);
});

test('hides pricing and returns navigation to downloads when the service fails', async ({ page }) => {
  await page.route(`${paymentOrigin}/api/pricing`, route => route.fulfill({ status: 503, json: {} }));
  await page.goto(siteUrl);
  await expect(page.locator('#root')).toHaveAttribute('data-hydrated', 'true');
  await expect(page.locator('.hero-actions .primary')).toHaveAttribute('href', '#download');
  await expect(page.locator('#pricing')).toHaveCount(0);
  await expect(page.locator('a[href$="#pricing"]')).toHaveCount(0);
});

test('accepts a zero-price trial alongside paid pricing and preserves separate checkout identities', async ({ page }) => {
  await page.route(`${paymentOrigin}/api/pricing`, route => route.fulfill({ json: { products: [product, trial] } }));
  await page.goto(siteUrl);
  await expect(page.locator('#pricing [data-product-id]').first()).toHaveAttribute('data-product-id', trial.id);
  const card = page.locator(`[data-product-id="${trial.id}"]`);
  await expect(card).toContainText('Free');
  await expect(card).toContainText('7 days from your first activation');
  await expect(card).toContainText('Activate on 1 device');
  await expect(card).toContainText('One claim per email and installation');
  const start = card.getByRole('link', { name: 'Start free trial' });
  await expect(start).toHaveAttribute('href', trial.checkoutUrl);
  await expect(start).toHaveAttribute('data-umami-event', 'trial-start');
  await expect(start).toHaveAttribute('data-umami-event-product', trial.id);
  await expect(page.locator('.hero-actions .primary')).toHaveAttribute('href', '#pricing');
  await expect(page.locator('.hero-actions .primary')).not.toHaveAttribute('download');
  await expect(page.locator('.hero-actions .text-link')).toHaveAttribute('href', '#tutorial');
  await expect(page.locator('#pricing')).toContainText('Research opportunities');
  await expect(page.locator('#pricing')).toContainText('AI provider usage is billed separately');
  for (const theme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme: theme as 'light' | 'dark' });
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await expect(start).toBeVisible();
    }
  }
});

test('reads trial terms from the API and does not hardcode duration or product ID', async ({ page }) => {
  const changed = { ...trial, id: 'trial-new', name: 'Extended trial', licenseTerms: { ...trial.licenseTerms, durationDays: 14, startsOn: 'issuance', deviceLimit: 2 }, checkoutUrl: `${paymentOrigin}/?product=trial-new` };
  await page.route(`${paymentOrigin}/api/pricing`, route => route.fulfill({ json: { products: [changed] } }));
  await page.goto(siteUrl);
  await expect(page.locator('#pricing')).toContainText('14 days from license issuance');
  await expect(page.locator('#pricing')).toContainText('Activate on up to 2 devices');
  await expect(page.getByRole('link', { name: 'Start free trial' })).toHaveAttribute('href', changed.checkoutUrl);
});

test('a disabled or unsafe trial URL never becomes a claim link', async ({ page }) => {
  await page.route(`${paymentOrigin}/api/pricing`, route => route.fulfill({ json: { products: [
    { ...trial, checkoutAvailable: false },
    { ...trial, id: 'external', checkoutUrl: 'https://other.example/?product=external' },
  ] } }));
  await page.goto(siteUrl);
  await expect(page.locator('#pricing .pricing-unavailable')).toHaveCount(2);
  await expect(page.locator('#pricing .pricing-buy')).toHaveCount(0);
});

test('negative prices are rejected rather than presented as free trials', async ({ page }) => {
  await page.route(`${paymentOrigin}/api/pricing`, route => route.fulfill({ json: { products: [{ ...trial, pricing: { ...trial.pricing, amount: -1 } }] } }));
  await page.goto(siteUrl);
  await expect(page.locator('.hero-actions .primary')).toHaveAttribute('href', '#download');
  await expect(page.locator('#pricing')).toHaveCount(0);
  await expect(page.locator('#pricing .pricing-buy')).toHaveCount(0);
});

test('hides pricing if the service does not respond within eight seconds', async ({ page }) => {
  await page.clock.install();
  await page.route(`${paymentOrigin}/api/pricing`, () => {});
  await page.goto(siteUrl);
  await expect(page.locator('#root')).toHaveAttribute('data-hydrated', 'true');
  await page.clock.fastForward(8100);
  await expect(page.locator('#pricing')).toHaveCount(0);
  await expect(page.locator('.nav-download')).toHaveAttribute('href', '/#download');
});
