import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

test('feature board presents features and opens real screenshots', async ({ page }) => {
  await page.goto('/');
  await page.locator('.feature-board').scrollIntoViewIfNeeded();
  await expect(page.locator('.feature-card')).toHaveCount(3);
  await expect(page.getByRole('tablist')).toHaveCount(0);
  const enlarge = page.getByRole('button', {name:'Enlarge commercial brief screenshot'});
  await enlarge.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText('Brief editor with a sanitized example.');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(enlarge).toBeFocused();
});

test('theme persists, FAQ opens, and preview downloads show their platform details', async ({page}) => {
  await page.emulateMedia({colorScheme:'light'});
  await page.goto('/');
  await page.getByRole('button',{name:'Switch to dark appearance'}).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await page.getByText('Does it upload to Adobe Stock for me?',{exact:true}).click();
  await expect(page.locator('details[open]')).toContainText('upload it manually');
  await page.getByRole('link',{name:'Download Thoock',exact:true}).click();
  await expect(page).toHaveURL(/#download$/);
  await expect(page.locator('#download .platform-download')).toHaveCount(2);
  await expect(page.locator('#download .unavailable')).toHaveCount(0);
  await expect(page.locator('#download')).toContainText('Apple silicon (ARM64)');
  await expect(page.locator('#download')).toContainText('Unsigned installer');
});

test('page fits supported widths in both themes without broken images', async ({page}) => {
  const errors:string[]=[];
  page.on('pageerror', error=>errors.push(error.message));
  for(const width of [320,375,390,768,1024,1280,1440]) {
    await page.setViewportSize({width,height:900});
    await page.goto('/');
    await page.evaluate(async()=>{ await document.fonts.ready; });
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow at ${width}`).toBe(true);
    await expect(page.getByRole('heading',{level:1})).toBeVisible();
    expect(await page.locator('.hero-actions .primary').evaluate(el=>el.getBoundingClientRect().bottom)).toBeLessThan(900);
    // Visit lazy previews instead of jumping past them to a distant section.
    for (const image of await page.locator('img[loading="lazy"]').all()) {
      if (await image.isVisible()) await image.scrollIntoViewIfNeeded();
    }
    await expect.poll(()=>page.locator('img').evaluateAll(images=>images.filter(image=>image.getClientRects().length>0).every(image=>(image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth>0))).toBe(true);
  }
  await page.getByRole('button',{name:'Switch to dark appearance'}).click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('reduced motion and mobile platform visitors remain usable',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce',colorScheme:'dark'});
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  expect(await page.locator('html').evaluate(el=>getComputedStyle(el).scrollBehavior)).toBe('auto');
  expect(await page.evaluate(()=>document.getAnimations().filter(animation=>animation.playState==='running').length)).toBe(0);
  await page.locator('.feature-board').scrollIntoViewIfNeeded();
  await expect(page.locator('#root')).toHaveAttribute('data-hydrated','true');
  await expect(page.locator('.feature-replay')).toHaveCount(0);
  await expect(page.getByRole('heading',{name:'Generate possibilities. Keep the good ones.'})).toBeVisible();
  await page.getByRole('link',{name:'Download Thoock',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Make room for your next batch.'})).toBeVisible();
});


test('changelog is a separate page with working navigation and version permalinks', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.release-history')).toHaveCount(0);
  const latest = page.locator('#download .latest-update-link');
  await expect(latest).toContainText('v0.1.0');
  await expect(latest).toHaveAttribute('href', '/changelog/');
  await page.getByRole('navigation', {name:'Main navigation'}).getByRole('link', {name:'Changelog'}).click();
  await expect(page).toHaveURL(/\/changelog\/?$/);
  await expect(page).toHaveTitle('Changelog | Thoock');
  await expect(page.getByRole('heading', {level:1})).toHaveText('What’s new.');
  const history = page.locator('.release-history');
  await expect(history.getByText('v0.1.0', {exact:true})).toBeVisible();
  await expect(history.getByText('Latest update', {exact:true})).toBeVisible();
  await expect(history.locator('time')).toHaveAttribute('datetime', '2026-10-14');
  await expect(history.getByText('Release preview', {exact:true})).toBeVisible();
  await expect(history.getByRole('heading', {name:'Also in this update'})).toBeVisible();
  await page.getByRole('link', {name:'Link to version 0.1.0'}).click();
  await expect(page).toHaveURL(/#v0\.1\.0$/);
  await page.reload();
  await expect(history.getByText('Operating-system credential storage and redacted provider logs.')).toBeVisible();
  await page.getByRole('navigation').getByRole('link', {name:'Workflow', exact:true}).click();
  await expect(page).toHaveURL(/\/#workflow$/);
  await expect(page.getByRole('heading', {name:'An idea is just the beginning. Give it somewhere to go.'})).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', {level:1})).toHaveText('What’s new.');
});

test('direct changelog loads, mobile layouts, themes, and download return links work', async ({page}) => {
  await page.emulateMedia({colorScheme:'light',reducedMotion:'reduce'});
  for (const width of [320,390,768,1024,1440]) {
    await page.setViewportSize({width,height:900});
    await page.goto('/changelog/');
    await expect(page.getByRole('heading',{level:1})).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await expect(page.locator('.release-figure img')).toBeVisible();
  }
  await page.getByRole('button',{name:'Switch to dark appearance'}).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await page.getByRole('link', {name:'Back to downloads',exact:true}).click();
  await expect(page).toHaveURL(/\/#download$/);
  await expect(page.getByRole('heading', {name:'Make room for your next batch.'})).toBeVisible();
  await page.goto('/#changelog');
  await expect(page).toHaveURL(/\/changelog\/?$/);
});

test('page load is sequenced and scroll entrances play once, with live reduced-motion cancellation', async ({page}) => {
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/');
  await expect(page.locator('#root')).toHaveAttribute('data-prerendered','true');
  expect(await page.locator('.hero h1').evaluate(element=>getComputedStyle(element).animationName)).toBe('html-enter-painted');
  await expect(page.locator('.hero-actions .primary')).toBeVisible();
  await page.locator('.feature-plan').scrollIntoViewIfNeeded();
  await expect.poll(()=>page.locator('.feature-plan').evaluate(element=>element.getAnimations().some(animation=>animation.id==='scroll-entrance'))).toBe(true);
  await expect.poll(()=>page.locator('.feature-plan').evaluate(element=>element.getAnimations().length)).toBe(0);
  await page.locator('.hero').scrollIntoViewIfNeeded();
  await page.locator('.feature-plan').scrollIntoViewIfNeeded();
  expect(await page.locator('.feature-plan').evaluate(element=>element.getAnimations().length)).toBe(0);
  await page.reload();
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect.poll(()=>page.evaluate(()=>document.getAnimations().filter(animation=>animation.id.startsWith('page-entrance:') || animation.id==='scroll-entrance').length)).toBe(0);
  await expect(page.locator('.hero h1')).toBeVisible();
  await expect(page.locator('.hero-actions .primary')).toBeEnabled();
});


test('installer links download the exact artifacts from the supplied manifest',async({page})=>{
  const manifest=JSON.parse(await readFile('public/downloads/build-manifest.json','utf8'));
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/#download');
  for(const artifact of manifest.artifacts) {
    const link=page.locator(`#download a[download][href="${artifact.url}"]`);
    await expect(link).toHaveAttribute('download',artifact.filename);
    const pending=page.waitForEvent('download');
    await link.click();
    const download=await pending;
    expect(download.suggestedFilename()).toBe(artifact.filename);
    const bytes=await readFile((await download.path())!);
    expect(bytes.length).toBe(artifact.bytes);
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(artifact.sha256);
  }
  const checksums=await page.request.get('/downloads/SHA256SUMS.txt');
  expect(checksums.ok()).toBe(true);
  expect(await checksums.text()).toContain(manifest.artifacts[0].sha256);
});

test('hero offers the matching desktop installer and keeps mobile on download options',async({browser})=>{
  for(const [userAgent,label,href] of [
    ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)','Download for macOS','/downloads/Thoock_0.1.0_macos_arm64.dmg'],
    ['Mozilla/5.0 (Windows NT 10.0; Win64; x64)','Download for Windows','/downloads/Thoock_0.1.0_windows_x64_setup.exe'],
    ['Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)','View desktop downloads','#download'],
  ]) {
    const page=await browser.newPage({userAgent,reducedMotion:'reduce'});
    await page.goto('http://127.0.0.1:5173');
    const action=page.locator('.hero-actions .primary');
    await expect(action).toHaveText(label);
    await expect(action).toHaveAttribute('href',href);
    if(userAgent.includes('Macintosh')) await expect(page.locator('.hero-release-info')).toContainText('Apple silicon (ARM64)');
    if(userAgent.includes('iPhone')) expect(await action.getAttribute('download')).toBeNull();
    await page.close();
  }
});

test('loads only the icons used by the page instead of the complete icon library', async ({page}) => {
  await page.goto('/');
  await expect(page.locator('#root')).toHaveAttribute('data-hydrated','true');
  await expect(page.locator('svg.lucide').first()).toBeVisible();
  const iconBytes=await page.evaluate(()=>performance.getEntriesByType('resource')
    .filter(entry=>entry.name.includes('lucide'))
    .reduce((total,entry)=>total+(entry as PerformanceResourceTiming).decodedBodySize,0));
  expect(iconBytes).toBeLessThan(400_000);
  expect(iconBytes).toBeGreaterThan(0);
});


test('meaningful page content and downloads are present before React or JavaScript runs', async ({browser}) => {
  const page=await browser.newPage({javaScriptEnabled:false,reducedMotion:'reduce'});
  await page.goto('http://127.0.0.1:5173');
  await expect(page.getByRole('heading',{level:1})).toContainText('Your stock-image workflow.');
  await expect(page.locator('#download a.platform-download')).toHaveCount(2);
  await page.getByText('Do I need a Thoock account?',{exact:true}).click();
  await expect(page.locator('details[open]')).toContainText('no Thoock sign-in');
  await page.getByRole('contentinfo').getByRole('link',{name:'Changelog'}).click();
  await expect(page.getByRole('heading',{level:1})).toHaveText('What’s new.');
  await page.close();
});

test('hydration keeps dark appearance and platform downloads without recoverable errors', async ({browser})=>{
  const page=await browser.newPage({colorScheme:'dark',userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'});
  const errors:string[]=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  await page.goto('http://127.0.0.1:5173');
  await expect(page.locator('.hero-actions .primary')).toHaveText('Download for Windows');
  await expect(page.getByRole('button',{name:'Switch to light appearance'})).toBeVisible();
  await page.getByRole('button',{name:'Switch to light appearance'}).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  await expect(page.locator('.hero-actions .primary')).toHaveAttribute('href','/downloads/Thoock_0.1.0_windows_x64_setup.exe');
  expect(errors).toEqual([]);
  await page.close();
});

test('a first button click is preserved while the React chunk is still loading',async({page})=>{
  await page.emulateMedia({colorScheme:'light',reducedMotion:'reduce'});
  let unblock!:()=>void;
  const gate=new Promise<void>(resolve=>{unblock=resolve;});
  await page.route('**/src/hydrate.tsx*',async route=>{await gate;await route.continue();});
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await expect(page.locator('#root')).not.toHaveAttribute('data-hydrated','true');
  await page.getByRole('button',{name:'Switch to dark appearance'}).click();
  unblock();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await expect(page.locator('#root')).toHaveAttribute('data-hydrated','true');
});

test('mobile loads the selected hero image without also preloading the desktop original',async({browser})=>{
  const page=await browser.newPage({viewport:{width:412,height:823},deviceScaleFactor:1.75,isMobile:true,reducedMotion:'reduce'});
  const requested:string[]=[];
  page.on('request',request=>{if(request.url().includes('/screenshots/review-queue'))requested.push(new URL(request.url()).pathname);});
  await page.goto('http://127.0.0.1:5173');
  await page.waitForFunction(()=>(document.querySelector('.hero-screenshot') as HTMLImageElement)?.complete);
  expect(requested).toContain('/screenshots/review-queue-800.webp');
  expect(requested).not.toContain('/screenshots/review-queue.webp');
  await page.close();
});

test('appearance follows the system until overridden and synchronizes between tabs', async ({ context }) => {
  const first = await context.newPage();
  const second = await context.newPage();
  await Promise.all([first.emulateMedia({ colorScheme: 'light' }), second.emulateMedia({ colorScheme: 'light' })]);
  await Promise.all([first.goto('/'), second.goto('/')]);
  await expect(first.locator('#root')).toHaveAttribute('data-hydrated', 'true');
  await expect(second.locator('#root')).toHaveAttribute('data-hydrated', 'true');
  await first.emulateMedia({ colorScheme: 'dark' });
  await expect(first.getByRole('button', { name: 'Switch to light appearance' })).toBeVisible();
  await first.getByRole('button', { name: 'Switch to light appearance' }).click();
  await second.getByRole('button', { name: 'Switch to dark appearance' }).click();
  await expect(first.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(first.getByRole('button', { name: 'Switch to light appearance' })).toBeVisible();
  await first.emulateMedia({ colorScheme: 'light' });
  await expect(first.getByRole('button', { name: 'Switch to light appearance' })).toBeVisible();
  await second.evaluate(() => localStorage.removeItem('thoock-appearance'));
  await expect(first.locator('html')).not.toHaveAttribute('data-theme');
  await first.emulateMedia({ colorScheme: 'light' });
  await expect(first.getByRole('button', { name: 'Switch to dark appearance' })).toBeVisible();
  await Promise.all([first.close(), second.close()]);
});

test('screenshot previews expose their name and restore focus across repeated opens', async ({ page }) => {
  await page.goto('/');
  for (const [button, name] of [
    ['Enlarge commercial brief screenshot', 'Commercial brief in Thoock'],
    ['Enlarge image review screenshot', 'Image review in Thoock'],
  ]) {
    const trigger = page.getByRole('button', { name: button });
    await trigger.click();
    const dialog = page.getByRole('dialog', { name });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('img')).toHaveCount(1);
    await dialog.getByRole('button', { name: 'Close screenshot' }).click();
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await expect(page.locator('.image-dialog img')).toHaveCount(0);
  }
});
