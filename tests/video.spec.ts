import { test, expect } from '@playwright/test';

test('tutorial loads only on play and supports captions, playback, and seeking', async ({ page }) => {
  const mediaRequests: string[] = [];
  page.on('request', request => { if (request.url().endsWith('.mp4')) mediaRequests.push(request.url()); });
  await page.goto('http://127.0.0.1:4173/');
  const video = page.locator('#tutorial video');
  await video.scrollIntoViewIfNeeded();
  await expect(video).toHaveAttribute('preload', 'none');
  await expect(video).not.toHaveAttribute('autoplay');
  await expect(video.locator('track')).toHaveAttribute('kind', 'captions');
  await expect(video.locator('track')).toHaveAttribute('src', '/videos/thoock-tutorial.vtt');
  expect(mediaRequests).toEqual([]);
  await video.evaluate(async (el: HTMLVideoElement) => { el.muted = true; await el.play(); });
  await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime)).toBeGreaterThan(0.1);
  const metadata = await video.evaluate(async (el: HTMLVideoElement) => {
    await new Promise<void>(resolve => { el.addEventListener('seeked', () => resolve(), { once: true }); el.currentTime = 120; });
    el.pause();
    return { duration: el.duration, width: el.videoWidth, height: el.videoHeight, error: el.error };
  });
  expect(metadata.duration).toBeGreaterThan(147);
  expect(metadata.duration).toBeLessThan(149);
  expect(metadata).toMatchObject({ width: 1920, height: 1080, error: null });
});
