import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
await mkdir('qa/tide', {recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const results=[];
const base=(process.env.TEST_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
try {
 for(const viewport of [{width:1440,height:900},{width:390,height:844}]) {
  const context=await browser.newContext({viewport,isMobile:viewport.width<700,hasTouch:viewport.width<700});
  const page=await context.newPage(); const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.addInitScript(()=>{window.violations=[];document.addEventListener('securitypolicyviolation',e=>window.violations.push(e.effectiveDirective));});
  await page.goto(`${base}/zh/`,{waitUntil:'networkidle'});
  await page.waitForSelector('#ink-canvas.ready');
  await page.waitForFunction(()=>document.querySelector('.hero-wordmark svg').dataset.writing==='false');
  const distance=await page.locator('.opening-sequence').evaluate(el=>el.offsetHeight-el.querySelector('.hero').offsetHeight);
  assert(distance>300);
  for(const fraction of [0,.2,.42,.66,.86,1.1]) {
   await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),distance*fraction);
   await page.waitForTimeout(850);
   const state=await page.locator('.hero').evaluate(el=>({progress:Number(el.dataset.tideProgress),top:el.getBoundingClientRect().top,centerOpacity:Number(getComputedStyle(el.querySelector('.hero-center')).opacity)}));
   assert(Math.abs(state.progress-Math.min(fraction,1))<.03,JSON.stringify(state));
   if(fraction<1)assert(Math.abs(state.top)<2,'Hero must hold the frame');
   if(fraction===.2)assert(Number(await page.locator('#tide-displacement').getAttribute('scale'))>10,'Name should refract during the wave');
   if(fraction===.86)assert(await page.locator('#abstract h2').evaluate(el=>el.getBoundingClientRect().top<innerHeight),'Article should enter before the shot ends');
   await page.screenshot({path:`qa/tide/${viewport.width}-${fraction}.png`});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Horizontal overflow');
  }
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(1000);
  assert.equal(await page.locator('.hero-center').evaluate(el=>el.inert),false);
  assert(Number(await page.locator('.hero-center').evaluate(el=>getComputedStyle(el).opacity))>.99);
  assert.deepEqual(await page.evaluate(()=>window.violations),[]);
  assert.deepEqual(errors,[]);
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(300);
  assert.equal(await page.locator('.opening-sequence').evaluate(el=>el.classList.contains('tide-enabled')),false);
  assert.equal(await page.locator('.hero').evaluate(el=>getComputedStyle(el).position),'relative');
  results.push({viewport,distance,reverse:true,reducedMotion:true,errors});
  await context.close();
 }
 console.log(JSON.stringify(results,null,2));
 await writeFile('qa/tide/results.json',JSON.stringify(results,null,2));
}finally{await browser.close();}
