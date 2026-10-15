import {test,expect} from '@playwright/test';

test('built pages deliver correct HTML and usable downloads without JavaScript',async({browser})=>{
  const page=await browser.newPage({javaScriptEnabled:false,reducedMotion:'reduce'});
  await page.goto('http://127.0.0.1:4173/');
  await expect(page.getByRole('heading',{level:1})).toContainText('Your stock-image workflow.');
  await expect(page.locator('#download a.platform-download')).toHaveCount(2);
  await page.goto('http://127.0.0.1:4173/changelog');
  await expect(page).toHaveURL('http://127.0.0.1:4173/changelog/');
  await expect(page).toHaveTitle('Changelog | Thoock');
  await expect(page.getByRole('heading',{level:1})).toHaveText('What’s new.');
  await page.close();
});

test('built routes hydrate without replacing mismatched HTML or losing interactions',async({browser})=>{
  const page=await browser.newPage({colorScheme:'dark',reducedMotion:'reduce'});
  const errors:string[]=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  for(const route of ['/','/changelog','/changelog/']) {
    await page.goto(`http://127.0.0.1:4173${route}`);
    await expect(page.locator('#root')).toHaveAttribute('data-hydrated','true');
    await expect(page.getByRole('button',{name:'Switch to light appearance'})).toBeVisible();
  }
  await page.getByRole('button',{name:'Switch to light appearance'}).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  expect(errors).toEqual([]);
  await page.close();
});
