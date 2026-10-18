import { test, expect } from '@playwright/test';

const production = 'http://127.0.0.1:4173';

test('prerendered installer links carry readable titles and release properties without JavaScript', async ({ browser }) => {
  const page = await browser.newPage({ javaScriptEnabled: false });
  const index = await (await page.request.get(`${production}/releases/index.json`)).json();
  const latest = await (await page.request.get(`${production}/releases/latest.json`)).json();
  const archives = await Promise.all(index.versions.map(async (version: string) => (await page.request.get(`${production}/releases/${version}.json`)).json()));
  const countDownloads = (manifest: { downloads: Record<string, { alternativeUrl?: string }> }) => Object.values(manifest.downloads).reduce((count, download) => count + 1 + Number(Boolean(download.alternativeUrl)), 0);
  const archiveCount = archives.reduce((count, manifest) => count + countDownloads(manifest), 0);
  for (const [path, count, source] of [['/', countDownloads(latest), 'downloads'], ['/changelog/', archiveCount, 'changelog']] as const) {
    await page.goto(`${production}${path}`);
    const links = page.locator('a[data-umami-event="desktop-download"]');
    await expect(links).toHaveCount(count);
    for (const link of await links.all()) {
      const file = (await link.getAttribute('href'))!.split('/').pop()!;
      const version = file.match(/Thoock_([\d.]+)_/)![1];
      const format = file.split('.').pop()!.toUpperCase();
      await expect(link).toHaveAttribute('title', new RegExp(`Thoock v${version}.*${format}`));
      await expect(link).toHaveAttribute('data-umami-event-title', (await link.getAttribute('title'))!);
      await expect(link).toHaveAttribute('data-umami-event-version', version);
      await expect(link).toHaveAttribute('data-umami-event-format', format);
      await expect(link).toHaveAttribute('data-umami-event-source', source);
      await expect(link).toHaveAttribute('data-umami-event-file', file);
      await expect(link).toHaveAttribute('data-umami-event-platform', /^(macOS|Windows)$/);
      await expect(link).toHaveAttribute('data-umami-event-architecture', /ARM64|x64/);
    }
    await expect(page.locator('a[data-umami-event][href*="SHA256SUMS"]')).toHaveCount(0);
    await expect(page.locator('.nav-download')).not.toHaveAttribute('data-umami-event');
  }
  await page.close();
});

test('hydrated desktop hero is labelled while mobile download navigation is not counted', async ({ browser }) => {
  for (const [userAgent, platform] of [
    ['Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Windows'],
    ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'macOS'],
    ['Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)', null],
  ] as const) {
    const page = await browser.newPage({ userAgent });
    await page.goto(production);
    await expect(page.locator('#root')).toHaveAttribute('data-hydrated', 'true');
    const hero = page.locator('.hero-actions .primary');
    if (platform) {
      await expect(hero).toHaveAttribute('data-umami-event', 'desktop-download');
      await expect(hero).toHaveAttribute('data-umami-event-source', 'hero');
      await expect(hero).toHaveAttribute('data-umami-event-platform', platform);
    } else {
      await expect(hero).not.toHaveAttribute('data-umami-event');
    }
    await page.close();
  }
});

test('tracking configuration is optional and included once on each production page when enabled', async ({ page }) => {
  const scriptUrl = process.env.VITE_UMAMI_SCRIPT_URL;
  const websiteId = process.env.VITE_UMAMI_WEBSITE_ID;
  if (scriptUrl) await page.route(scriptUrl, route => route.fulfill({ contentType: 'application/javascript', body: '' }));
  for (const path of ['/', '/changelog/']) {
    await page.goto(`${production}${path}`);
    const tracker = page.locator('script[data-website-id]');
    await expect(tracker).toHaveCount(scriptUrl && websiteId ? 1 : 0);
    if (scriptUrl && websiteId) {
      await expect(tracker).toHaveAttribute('src', scriptUrl);
      await expect(tracker).toHaveAttribute('data-website-id', websiteId);
      await expect(tracker).toHaveAttribute('data-domains', 'thoock.ryuda.me');
      await expect(tracker).toHaveAttribute('data-exclude-hash', 'true');
      await expect(tracker).toHaveAttribute('defer', '');
    }
  }
  // The download works even if the tracker is absent or blocked.
  const link = page.locator('.release-entry').first().locator('a[download]').first();
  const filename = await link.getAttribute('download');
  const pending = page.waitForEvent('download');
  await link.click();
  expect((await pending).suggestedFilename()).toBe(filename);
});
