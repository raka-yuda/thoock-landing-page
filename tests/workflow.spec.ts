import { test, expect } from '@playwright/test';

test('balanced workflow preserves full windows and has no layout controls, even with old saved settings', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('thoock-layout-tweaks', JSON.stringify({ layout: 'gallery', width: 70, captions: false })));
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('#root')).toHaveAttribute('data-hydrated', 'true');
    await expect(page.getByRole('button', { name: 'Layout lab' })).toHaveCount(0);
    const geometry = await page.evaluate(() => ({
      fits: document.documentElement.scrollWidth <= innerWidth,
      fullWindows: [...document.querySelectorAll<HTMLImageElement>('#workflow img')].every(img => {
        const box = img.getBoundingClientRect();
        return Math.abs(box.width / box.height - Number(img.getAttribute('width')) / Number(img.getAttribute('height'))) < 0.01;
      }),
      supportingScreens: innerWidth < 768 || getComputedStyle(document.querySelector('.contact-strip>.product-screen')!).gridColumn === 'auto',
      aligned: Math.abs(document.querySelector('.making-scene>.product-screen')!.getBoundingClientRect().width - document.querySelector('.making-scene>.product-screen:last-child')!.getBoundingClientRect().width) < 1,
    }));
    expect(geometry).toEqual({ fits: true, fullWindows: true, aligned: true, supportingScreens: true });
  }
});
