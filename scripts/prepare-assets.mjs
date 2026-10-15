import sharp from 'sharp';
import { chromium } from '@playwright/test';
const docs = '../thoock-desktop-app/docs/screenshots';
await sharp(`${docs}/pages/review-queue.png`).extract({left:270,top:82,width:1315,height:815}).resize(1500).webp({quality:86}).toFile('public/screenshots/review-queue.webp');
await sharp(`${docs}/modals/briefs-edit-detail.png`).extract({left:288,top:69,width:1024,height:876}).resize(1100).webp({quality:86}).toFile('public/screenshots/brief.webp');
await sharp(`${docs}/pages/review-queue.png`).extract({left:289,top:263,width:240,height:182}).resize(480).webp({quality:88}).toFile('public/screenshots/landscape.webp');
const browser = await chromium.launch({channel:'chrome',headless:true});
const page = await browser.newPage({viewport:{width:1440,height:960},deviceScaleFactor:1});
await page.addInitScript(()=>{localStorage.setItem('thoock-demo','true');localStorage.setItem('thoock-theme','light');});
for (const [name,hash] of [['research','opportunities'],['generate','generation'],['export','exports'],['workspace','settings'],['review','review']]) {
 await page.goto(`http://127.0.0.1:1421/#/${hash}`);
 await page.waitForTimeout(700);
 await page.locator('main').screenshot({path:`/tmp/thoock-${name}.png`});
 await sharp(`/tmp/thoock-${name}.png`).resize({width:1300,withoutEnlargement:true}).webp({quality:86}).toFile(`public/screenshots/${name}.webp`);
}
await browser.close();
