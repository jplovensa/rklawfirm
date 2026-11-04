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
  // The opening replays on refresh and remains escapable / motion-aware.
  const introContext=await browser.newContext(); const introPage=await introContext.newPage();
  await introPage.goto(base+'/index.html');
  await introPage.locator('.opening-film').waitFor({state:'visible'});checks++;
  await introPage.getByRole('button',{name:'Skip opening'}).click();
  await introPage.locator('.opening-film').waitFor({state:'hidden'});checks++;
  await introPage.reload();await introPage.locator('.opening-film').waitFor({state:'visible'});checks++;
  await introPage.locator('.opening-skip').click();await introPage.locator('.opening-film').waitFor({state:'hidden'});
  await introPage.goto(base+'/notary.html');await introPage.locator('.opening-film').waitFor({state:'visible'});checks++;
  await introPage.locator('.opening-skip').click();await introPage.locator('.opening-film').waitFor({state:'hidden'});
  await introContext.close();
  const escapeContext=await browser.newContext();const escapePage=await escapeContext.newPage();
  await escapePage.goto(base+'/index.html');await escapePage.locator('.opening-film').waitFor({state:'visible'});
  await escapePage.keyboard.press('Escape');await escapePage.locator('.opening-film').waitFor({state:'hidden'});checks++;
  await escapeContext.close();
  const reducedContext=await browser.newContext({reducedMotion:'reduce'});const reducedPage=await reducedContext.newPage();
  await reducedPage.goto(base+'/notary.html');assert.equal(await reducedPage.locator('.opening-film').evaluate(e=>e.open),false);assert.equal(await reducedPage.locator('.hero-video').getAttribute('src'),null);checks++;
  await reducedContext.close();
  const failedContext=await browser.newContext();await failedContext.route('**/*.mp4',route=>route.abort());const failedPage=await failedContext.newPage();
  await failedPage.goto(base+'/index.html');await failedPage.locator('.opening-film').waitFor({state:'hidden',timeout:6000});
  assert.equal(await failedPage.locator('html').evaluate(e=>e.classList.contains('opening-active')),false);checks++;
  await failedContext.close();
  const page=await browser.newPage({viewport:{width:1440,height:1100},deviceScaleFactor:1});
  async function dismissOpening() {
   if (await page.locator('.opening-film').evaluate(el=>el.open)) {
    await page.locator('.opening-skip').click();await page.locator('.opening-film').waitFor({state:'hidden'});
   }
  }
  async function visit(url) { const response = await page.goto(url); await dismissOpening(); return response; }
  async function reload() { await page.reload(); await dismissOpening(); }
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text())});
  for (const route of ['index.html','notary.html']) {
   const response=await visit(`${base}/${route}`);assert.equal(response.status(),200);checks++;
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
   if(route==='index.html' || route==='notary.html') await page.locator('.hero-video').evaluate(async v=>{v.pause();if(v.readyState>=1){v.currentTime=5;await new Promise(resolve=>v.addEventListener('seeked',resolve,{once:true}))}});
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
  await visit(`${base}/index.html`);
  await page.waitForFunction(()=>document.querySelector('.hero-video').readyState>=2);
  assert.equal(await page.locator('.hero-video').evaluate(v=>v.muted),true);checks++;
  assert.equal(await page.locator('.hero-video').evaluate(v=>v.paused),false);checks++;
  await page.getByRole('button',{name:'Pause background video'}).click();
  assert.equal(await page.locator('.hero-video').evaluate(v=>v.paused),true);checks++;
  await page.getByRole('button',{name:'Play background video'}).click();
  await page.waitForFunction(()=>!document.querySelector('.hero-video').paused);checks++;
  await page.emulateMedia({reducedMotion:'reduce'});await visit(`${base}/index.html`);
  assert.equal(await page.locator('.hero-video').getAttribute('src'),null);checks++;
  assert.equal(await page.locator('.hero-video').evaluate(v=>v.paused),true);checks++;
  await page.emulateMedia({reducedMotion:'no-preference'});
  await visit(`${base}/notary.html#services`);
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
  await visit(`${base}/notary.html#legalisation`);
  assert.equal(await page.locator('#tab-legalisation').getAttribute('aria-selected'),'true');checks++;
  await reload();assert.equal(await page.locator('#tab-legalisation').getAttribute('aria-selected'),'true');checks++;
  await page.evaluate(()=>document.fonts.ready);
  assert.ok(await page.evaluate(()=>document.fonts.check('400 16px Inter')));checks++;
  assert.ok(await page.evaluate(()=>getComputedStyle(document.body).fontFamily.startsWith('Inter')));checks++;
  await visit(`${base}/notary.html#services`);await page.locator('[data-service-picker]').scrollIntoViewIfNeeded();
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
  await visit(`${base}/index.html#corporate`);assert.equal(await page.locator('#corporate').getAttribute('open'),'');checks++;
  await visit(`${base}/index.html`);await page.locator('.notary-strip a').click();assert.ok(page.url().endsWith('/notary.html'));checks++;
  await page.emulateMedia({reducedMotion:'reduce'});await visit(`${base}/index.html`);
  assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');checks++;
  // A language change preserves the service and updates every part of the enquiry.
  await visit(`${base}/notary.html#legalisation`);
  await page.getByRole('button',{name:'Bahasa Indonesia',exact:true}).click();
  assert.equal(await page.locator('html').getAttribute('lang'),'id');checks++;
  assert.ok((await page.locator('h1').innerText()).includes('Bersama Anda,'));checks++;
  assert.equal(await page.locator('#tab-legalisation').getAttribute('aria-selected'),'true');checks++;
  assert.ok((await page.locator('#legalisation').innerText()).includes('Legalisasi & Waarmerking'));checks++;
  const translatedEnquiry=await page.locator('#legalisation .button').getAttribute('href');
  assert.ok(new URL(translatedEnquiry).searchParams.get('text').startsWith('Halo,'));checks++;
  assert.ok(new URL(translatedEnquiry).searchParams.get('text').includes('Legalisasi & Waarmerking'));checks++;
  await reload();assert.equal(await page.locator('html').getAttribute('lang'),'id');checks++;
  await page.getByRole('button',{name:'Layanan berikutnya'}).click();assert.equal(await page.locator('#tab-copies').getAttribute('aria-selected'),'true');checks++;
  await page.getByRole('button',{name:'Layanan sebelumnya'}).click();assert.equal(await page.locator('#tab-legalisation').getAttribute('aria-selected'),'true');checks++;
  await page.locator('.return-to-rk').click();assert.equal(await page.locator('html').getAttribute('lang'),'id');checks++;
  assert.ok((await page.locator('h1').innerText()).includes('Pemahaman hukum.'));checks++;
  await visit(`${base}/notary.html?lang=id#legalisation`);
  assert.ok((await page.locator('.notary-header .brand').innerText()).includes('Nadia Difa Khairunnisa'));checks++;
  assert.equal(await page.locator('.notary-header .rk-logo').count(),0);checks++;
  await page.locator('#legalisation .prepare-visit').click();
  const planner=page.locator('.visit-planner');await planner.waitFor({state:'visible'});checks++;
  assert.ok((await planner.locator('[data-planner-service]').innerText()).includes('Legalisasi'));checks++;
  await planner.locator('[name=party][value=business]').check();
  await planner.locator('[data-sim-next]').click();
  assert.equal(await planner.locator('[data-scene="2"]').isVisible(),true);checks++;
  await planner.locator('[name=readiness][value=documents]').check();
  await planner.locator('[data-sim-next]').click();
  assert.equal(await planner.locator('[data-scene="3"]').isVisible(),true);checks++;
  let message=new URL(await planner.locator('.planner-send').getAttribute('href')).searchParams.get('text');
  assert.ok(message.includes('badan usaha')&&message.includes('dokumen')&&message.includes('Legalisasi'));checks++;
  assert.equal(await page.locator('[data-journey="3"]').getAttribute('aria-current'),'step');checks++;
  await page.keyboard.press('Escape');await planner.waitFor({state:'hidden'});
  assert.equal(await page.locator('#legalisation .prepare-visit').evaluate(e=>e===document.activeElement),true);checks++;
  await page.getByRole('button',{name:'English',exact:true}).click();
  await page.locator('#legalisation .prepare-visit').click();
  await planner.locator('[name=party][value=business]').check();
  await planner.locator('[data-sim-next]').click();
  await planner.locator('[name=readiness][value=documents]').check();
  await planner.locator('[data-sim-next]').click();
  message=new URL(await planner.locator('.planner-send').getAttribute('href')).searchParams.get('text');
  assert.ok(message.includes('a business')&&message.includes('documents')&&message.includes('Legalisation'));checks++;
  assert.ok((await planner.locator('[data-summary=party]').innerText()).includes('business'));checks++;
  await planner.locator('[data-sim-back]').click();assert.equal(await planner.locator('[data-scene="2"]').isVisible(),true);checks++;
  await planner.locator('[data-sim-next]').click();
  await planner.locator('[data-sim-restart]').click();assert.equal(await planner.locator('[data-scene="1"]').isVisible(),true);checks++;
  assert.equal(await planner.locator('[name=party][value=individual]').isChecked(),true);checks++;
  await planner.locator('[data-sim-next]').click();
  assert.equal(await planner.locator('[name=readiness][value=first]').isChecked(),true);checks++;
  await planner.locator('[data-sim-next]').click();
  message=new URL(await planner.locator('.planner-send').getAttribute('href')).searchParams.get('text');
  assert.ok(message.includes('an individual')&&message.includes('initial guidance'));checks++;
  await planner.locator('[data-sim-change-route]').click();await planner.waitFor({state:'hidden'});
  await page.waitForFunction(()=>document.activeElement?.id==='tab-legalisation');
  assert.equal(await page.locator('#tab-legalisation').evaluate(e=>e===document.activeElement),true);checks++;
  await page.locator('#legalisation .prepare-visit').click();

  await planner.getByRole('button',{name:'Close visit planner'}).click();await planner.waitFor({state:'hidden'});checks++;
  await page.setViewportSize({width:390,height:844});
  await page.locator('#legalisation .prepare-visit').click();
  assert.ok(await planner.evaluate(e=>e.scrollWidth<=e.clientWidth));checks++;
  await planner.getByRole('button',{name:'Close visit planner'}).click();await planner.waitFor({state:'hidden'});
  await page.getByRole('button',{name:'English',exact:true}).click();await reload();
  assert.equal(await page.locator('html').getAttribute('lang'),'en');checks++;
  // Long Bahasa strings remain usable across desktop and mobile widths.
  await visit(`${base}/notary.html?lang=id#services`);
  for (const width of [390,768,1024,1440]) {
   await page.setViewportSize({width,height:900});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Bahasa notary layout at ${width}`);checks++;
   assert.ok(await page.locator('h1 [data-i18n]').evaluateAll(xs=>xs.every(el=>{const range=document.createRange();range.selectNodeContents(el);return [...range.getClientRects()].every(rect=>rect.left>=0&&rect.right<=innerWidth)})),`Bahasa headline text is visible at ${width}`);checks++;
  }
  await page.screenshot({path:path.join(__dirname,'../test-results/notary-indonesian.png')});
  await visit(`${base}/index.html?lang=id`);
  for (const width of [390,768,1024]) {await page.setViewportSize({width,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Bahasa home layout at ${width}`);checks++;}
  await page.getByRole('button',{name:'English',exact:true}).click();
  await page.setViewportSize({width:1440,height:1000});
  await visit(`${base}/index.html`);assert.equal(await page.locator('.hero-video').getAttribute('data-video-src'),'assets/rk-city-hero.mp4');checks++;
  await visit(`${base}/notary.html`);assert.equal(await page.locator('.hero-video').getAttribute('data-video-src'),'assets/rk-hero.mp4');checks++;
  const heroBox=await page.locator('.hero-video').boundingBox();assert.equal(Math.round(heroBox.width),1440);checks++;
  await page.locator('[data-story-time="7"]').click();
  await page.waitForFunction(()=>document.querySelector('.hero-video').currentTime>=7);
  assert.equal(await page.locator('[data-story-time="7"]').getAttribute('aria-pressed'),'true');checks++;
  assert.deepEqual(errors,[]);checks++;
  console.log(`${checks} browser checks passed; no console or page errors. Desktop/mobile screenshots saved to test-results/.`);
 } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exit(1)});
