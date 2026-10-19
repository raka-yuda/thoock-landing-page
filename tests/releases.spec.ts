import { test, expect } from '@playwright/test';

test('production serves the shared release manifest and matching download links', async ({ page }) => {
  const response = await page.request.get('http://127.0.0.1:4173/releases/latest.json');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');
  const manifest = await response.json();
  expect(manifest.schemaVersion).toBe(1);
  await page.goto('http://127.0.0.1:4173/#download');
  await expect(page.locator('.header-brand .beta-badge')).toHaveCount(manifest.version.split('.')[0] === '0' ? 1 : 0);
  await expect(page.locator('main .beta-badge')).toHaveCount(0);
  for (const release of Object.values(manifest.downloads) as { url: string; bytes: number; sha256: string }[]) {
    await expect(page.locator(`#download a.platform-download[href="${release.url}"]`)).toBeVisible();
    expect(release.sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(release.bytes).toBeGreaterThan(0);
  }
  await expect(page.getByText('How do I install or update Thoock?', { exact: true })).toBeVisible();
});

test('changelog preserves downloads for every archived release', async ({ page }) => {
  const base = 'http://127.0.0.1:4173';
  const response = await page.request.get(`${base}/releases/index.json`);
  const index = await response.json();
  const latest = await (await page.request.get(`${base}/releases/latest.json`)).json();
  expect(index.latestVersion).toBe(latest.version);
  expect(index.versions[0]).toBe(latest.version);
  expect(index.versions).toContain('0.2.0');
  expect(index.versions).toContain('0.1.0');
  await page.goto(`${base}/changelog/`);
  await expect(page.locator('.header-brand .beta-badge')).toHaveCount(latest.version.split('.')[0] === '0' ? 1 : 0);
  for (const version of index.versions) {
    const manifest = await (await page.request.get(`${base}/releases/${version}.json`)).json();
    const entry = page.locator(`[id="v${version}"]`);
    await expect(entry).toContainText(`v${version}`);
    await expect(entry.locator('.release-meta .beta-badge')).toHaveCount(version.split('.')[0] === '0' ? 1 : 0);
    for (const download of Object.values(manifest.downloads) as { url: string }[]) {
      await expect(entry.locator(`a[href="${download.url}"]`)).toBeVisible();
      const file = await page.request.get(`${base}${download.url}`);
      expect(file.ok()).toBe(true);
      expect(Number(file.headers()['content-length'])).toBeGreaterThan(0);
    }
    const sums = await page.request.get(`${base}/downloads/${version}/SHA256SUMS.txt`);
    expect(sums.ok()).toBe(true);
    expect(await sums.text()).toMatch(/[a-f0-9]{64}/);
  }
  // Flat legacy URLs must remain usable for existing links.
  expect((await page.request.get(`${base}/downloads/Thoock_0.1.0_windows_x64_setup.exe`)).ok()).toBe(true);
});
