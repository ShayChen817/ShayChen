import {chromium} from 'playwright';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto('http://127.0.0.1:4322/en/',{waitUntil:'domcontentloaded'});
  await page.waitForSelector('[data-writing="true"]',{state:'attached'});
  await page.waitForTimeout(500);await page.screenshot({path:'qa/writing-01.png'});
  await page.waitForTimeout(900);await page.screenshot({path:'qa/writing-02.png'});
  await page.waitForSelector('[data-writing="false"]',{state:'attached'});
  assert.equal(await page.locator('#name-writing').count(),0);
  await page.waitForSelector('#ink-canvas.ready');
  const before=Number(await page.locator('#ink-canvas').getAttribute('data-frames'));
  await page.waitForTimeout(1500);
  const after=Number(await page.locator('#ink-canvas').getAttribute('data-frames'));
  assert(after>before+3,'Ink animation is not advancing');
  await page.screenshot({path:'qa/writing-complete.png'});
  await page.locator('#ink-canvas').evaluate(c=>({width:c.width,height:c.height}));
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>document.querySelector('#ink-canvas').getAttribute('data-running')==='false');
  const pausedFrame=await page.locator('#ink-canvas').getAttribute('data-frames');
  await page.waitForTimeout(350);
  assert.equal(await page.locator('#ink-canvas').getAttribute('data-frames'),pausedFrame);
  assert.equal(errors.length,0,errors.join('\n'));
  const result={writingFinished:true,inkFrames:{before,after},reducedMotionPaused:true,errors};
  await writeFile('qa/motion-verification.json',JSON.stringify(result,null,2));console.log(result);
}finally{await browser.close();}
