const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
let pw;
pw = require('@playwright/test');
const base = process.env.BASE_URL || 'http://127.0.0.1:4173';
(async () => {
 const browser = await pw.chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
 const errors=[]; let checks=0;
 try {
  const page=await browser.newPage({viewport:{width:1440,height:1100},deviceScaleFactor:1});
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text())});
  for (const route of ['index.html','notary.html']) {
   const response=await page.goto(`${base}/${route}`);assert.equal(response.status(),200);checks++;
   await page.evaluate(()=>document.fonts.ready);
   await page.locator('h1').waitFor();
   assert.equal(await page.locator('h1').count(),1);checks++;
   await page.locator('img').evaluateAll(xs=>Promise.all(xs.map(x=>{x.loading='eager';return x.decode()})));
   const imgs=await page.locator('img').evaluateAll(xs=>xs.every(x=>x.complete&&x.naturalWidth>0));assert.ok(imgs,'all images load');checks++;
   const hrefs=await page.locator('a[href]').evaluateAll(xs=>xs.map(x=>x.getAttribute('href')));
   for(const href of hrefs) { if(href.startsWith('#'))assert.ok(await page.locator(`[id="${href.slice(1)}"]`).count(),`anchor ${href}`); }
   assert.ok(hrefs.includes('https://wa.me/6285156129839'));checks++;
   await page.locator('details').first().locator('summary').click();assert.equal(await page.locator('details').first().getAttribute('open'),'');checks++;
   await page.locator('details').first().locator('summary').click();
   await page.evaluate(()=>{document.querySelectorAll('.reveal').forEach(x=>x.classList.add('is-visible'));window.scrollTo(0,0)});
   await page.waitForTimeout(900);
   if(route==='index.html') await page.locator('video').evaluate(async v=>{v.pause();if(v.readyState>=1){v.currentTime=5;await new Promise(resolve=>v.addEventListener('seeked',resolve,{once:true}))}});
   fs.mkdirSync(path.join(__dirname,'../test-results'),{recursive:true});
   await page.screenshot({path:path.join(__dirname,`../test-results/${route.replace('.html','')}-desktop.png`)});
   for(const width of [390,768,1024]) {
    await page.setViewportSize({width,height:844});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`no overflow ${route} at ${width}`);checks++;
   }
   await page.setViewportSize({width:390,height:844});
   const menu=page.getByRole('button',{name:'Menu'});await menu.click();assert.equal(await menu.getAttribute('aria-expanded'),'true');checks++;
   await page.keyboard.press('Escape');assert.equal(await menu.getAttribute('aria-expanded'),'false');checks++;
   await menu.click();await page.locator('#navigation').getByRole('link',{name:'Contact',exact:true}).click();assert.equal(await menu.getAttribute('aria-expanded'),'false');checks++;
   await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(500);
   await page.screenshot({path:path.join(__dirname,`../test-results/${route.replace('.html','')}-mobile.png`),fullPage:true});
   await page.setViewportSize({width:1440,height:1100});
  }
  await page.goto(`${base}/index.html`);
  await page.waitForFunction(()=>document.querySelector('video').readyState>=2);
  assert.equal(await page.locator('video').evaluate(v=>v.muted),true);checks++;
  assert.equal(await page.locator('video').evaluate(v=>v.paused),false);checks++;
  await page.getByRole('button',{name:'Pause background video'}).click();
  assert.equal(await page.locator('video').evaluate(v=>v.paused),true);checks++;
  await page.getByRole('button',{name:'Play background video'}).click();
  await page.waitForFunction(()=>!document.querySelector('video').paused);checks++;
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto(`${base}/index.html`);
  assert.equal(await page.locator('video').getAttribute('src'),null);checks++;
  assert.equal(await page.locator('video').evaluate(v=>v.paused),true);checks++;
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto(`${base}/notary.html#services`);
  await page.locator('[data-service-picker]').scrollIntoViewIfNeeded();
  const tabs = page.getByRole('tab');
  assert.equal(await tabs.count(),4); checks++;
  for (let i=0;i<4;i++) {
   await tabs.nth(i).click();
   assert.equal(await tabs.nth(i).getAttribute('aria-selected'),'true');
   assert.equal(await page.getByRole('tabpanel').count(),1);
   const title=await page.getByRole('tabpanel').locator('h3').innerText();
   const href=await page.getByRole('tabpanel').getByRole('link',{name:'Enquire about this service'}).getAttribute('href');
   assert.ok(new URL(href).searchParams.get('text').includes(title));checks++;
  }
  await tabs.nth(3).focus();await page.keyboard.press('ArrowRight');
  assert.equal(await tabs.nth(0).getAttribute('aria-selected'),'true');checks++;
  await page.keyboard.press('End');assert.equal(await tabs.nth(3).getAttribute('aria-selected'),'true');checks++;
  await page.keyboard.press('Home');assert.equal(await tabs.nth(0).getAttribute('aria-selected'),'true');checks++;
  await page.keyboard.press('Tab');assert.equal(await page.getByRole('tabpanel').evaluate(el=>el===document.activeElement),true);checks++;
  await page.goto(`${base}/notary.html#legalisation`);
  assert.equal(await page.locator('#tab-legalisation').getAttribute('aria-selected'),'true');checks++;
  await page.reload();assert.equal(await page.locator('#tab-legalisation').getAttribute('aria-selected'),'true');checks++;
  await page.evaluate(()=>document.fonts.ready);
  assert.ok(await page.evaluate(()=>document.fonts.check('400 16px Inter')));checks++;
  assert.ok(await page.evaluate(()=>getComputedStyle(document.body).fontFamily.startsWith('Inter')));checks++;
  await page.goto(`${base}/notary.html#services`);await page.locator('[data-service-picker]').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(__dirname,'../test-results/notary-menu-desktop.png')});
  await page.setViewportSize({width:390,height:844});
  await tabs.nth(2).click();await page.getByRole('tabpanel').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(__dirname,'../test-results/notary-menu-mobile.png')});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));checks++;
  await page.setViewportSize({width:1440,height:1100});
  const noJS=await browser.newContext({javaScriptEnabled:false});
  const fallback=await noJS.newPage();await fallback.goto(`${base}/notary.html`);
  assert.equal(await fallback.locator('[data-service-panel]:visible').count(),4);checks++;
  await noJS.close();
  await page.goto(`${base}/index.html#corporate`);assert.equal(await page.locator('#corporate').getAttribute('open'),'');checks++;
  await page.goto(`${base}/index.html`);await page.locator('.notary-strip a').click();assert.ok(page.url().endsWith('/notary.html'));checks++;
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto(`${base}/index.html`);
  assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');checks++;
  assert.deepEqual(errors,[]);checks++;
  console.log(`${checks} browser checks passed; no console or page errors. Desktop/mobile screenshots saved to test-results/.`);
 } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exit(1)});
