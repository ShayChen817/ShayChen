import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const base = process.env.TEST_URL || 'http://127.0.0.1:4322';
const prefix = new URL(base).pathname.replace(/\/$/,'');
const browser = await chromium.launch({ channel:'msedge', headless:true });
await mkdir('qa',{recursive:true});
const results=[];
try {
  for (const locale of ['en','zh']) {
    for (const viewport of [{width:1440,height:900},{width:360,height:740}]) {
      console.log(`Checking ${locale} ${viewport.width}`);
      const context=await browser.newContext({viewport,isMobile:viewport.width<700,hasTouch:viewport.width<700,permissions:['clipboard-read','clipboard-write']});
      const page=await context.newPage();
      const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
      const resourceErrors=[];
      page.on('response',r=>{if(r.status()>=400)resourceErrors.push(`${r.status()} ${r.url()}`);});
      const response=await page.goto(`${base}/${locale}/`,{waitUntil:'networkidle'});
      await page.waitForTimeout(1600);
      await page.waitForFunction(()=>document.querySelector('.hero-wordmark svg')?.getAttribute('data-writing')!=='true');
      await page.waitForSelector('#ink-canvas.ready');
      assert.equal(response.status(),200);
      const metrics=await page.evaluate(()=>({
        width:innerWidth,scrollWidth:document.documentElement.scrollWidth,
        heroLinks:[...document.querySelectorAll('.hero .links > *')].map(a=>({text:a.textContent,y:a.getBoundingClientRect().bottom})),
        headings:document.querySelectorAll('h1').length,
        images:[...document.querySelectorAll('img')].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src),
        shader:document.querySelector('#ink-canvas')?.classList.contains('ready')
      }));
      assert(metrics.scrollWidth<=metrics.width,`horizontal overflow: ${locale} ${viewport.width}`);
      assert(metrics.heroLinks.every(a=>a.y<=viewport.height),`hero links below fold: ${locale}`);
      assert.equal(metrics.headings,1);
      assert.equal(metrics.images.length,0);
      assert.equal(errors.length,0,errors.join('\n'));
      assert.equal(resourceErrors.length,0,resourceErrors.join('\n'));
      await page.screenshot({path:`qa/${locale}-${viewport.width}-hero.png`});
      assert.equal(await page.locator('.hero-subline,.hover-hint').count(),0);
      assert.equal(await page.locator('.hero-role p').innerText(),locale==='en'?'Engineer · Guitarist':'工程师 · 吉他手');
      assert.equal(await page.getByText(/Tsinghua University High School|清华大学附属中学/).count(),0);
      assert.equal(await page.locator('.early-stage h3').innerText(),'The Attic');
      assert.equal(await page.locator('.experience h3').first().innerText(),'Sweco');
      assert.equal(await page.locator('.hero-cv').getAttribute('href'),`${prefix}/assets/ShayChen_CV.pdf`);
      assert.equal(await page.locator('.chapter-mark').count(),0);
      assert((await page.locator('.home-mark img').getAttribute('src')).endsWith('/portrait-cutout-128.webp'));
      assert.equal(await page.locator('.hero-center .hero-location').innerText(),locale==='en'?'From Beijing · Based in Leuven, Belgium':'来自北京 · 现居比利时鲁汶');
      for(const number of ['+32456777145','+8618701126817']){
        const phone=page.locator(`.hero a[href="tel:${number}"]`);
        assert.equal(await page.locator(`a[href="tel:${number}"]`).count(),3);
        if(viewport.width>=700) await phone.hover();
        await page.waitForTimeout(300);
        assert.equal(await phone.locator('.country-flag').evaluate(el=>getComputedStyle(el).opacity),'1');
      }
      assert.equal(await page.locator('img[src*="stage-"], img[src*="-color.webp"], img[src*="seal.svg"]').count(),0);
      assert(await page.locator('.hero a[href="https://github.com/ShayChen817"]').count()>0);
      for(const side of ['portrait','nice']){
        const trigger=page.locator(`.name-zone[data-portrait="${side}"]`);
        if(viewport.width<700) await trigger.tap(); else await trigger.hover();
        await page.waitForTimeout(900);
        assert.equal(await page.locator('.hero').getAttribute('data-photo'),side);
        const opacity=await page.locator(`.hero-photo-${side}`).evaluate(el=>Number(getComputedStyle(el).opacity));
        assert(opacity>.25 && opacity<.5);
        await page.screenshot({path:`qa/${locale}-${viewport.width}-hover-${side}.png`});
      }
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.hero').getAttribute('data-photo'),'');
      await page.locator('#works').scrollIntoViewIfNeeded();
      await page.waitForTimeout(350);
      await page.screenshot({path:`qa/${locale}-${viewport.width}-works.png`});
      await page.locator('.work-main').first().click();
      await page.waitForTimeout(500);
      assert(await page.locator('#project-data').getAttribute('open')!==null);
      await page.locator('#site-index summary').click();
      assert(await page.locator('#site-index').getAttribute('open')!==null);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#site-index').getAttribute('open'),null);
      await page.locator('#contact').scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      await page.locator('#copy-email').click();
      assert.match(await page.locator('#copy-status').innerText(),/Copied|已复制/);
      assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),'shay04817@gmail.com');
      assert.equal(await page.locator('[data-language]').first().getAttribute('href'),`${prefix}/en/#contact`);
      assert.notEqual(await page.locator('#ink-canvas').getAttribute('data-running'),'true');
      const pdf=await context.request.get(`${base}/assets/ShayChen_CV.pdf`);
      assert.equal(pdf.status(),200);
      assert((await pdf.body()).subarray(0,4).toString()==='%PDF');
      assert((await pdf.body()).equals(await readFile('../ShayChen_CV.pdf')),'Published CV differs from latest source');
      const a11y=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
      results.push({locale,viewport,metrics,errors,violations:a11y.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
      if(viewport.width===1440){
        for(const section of ['abstract','engineering','recognition','art','notes','contact']){
          await page.locator(`#${section}`).scrollIntoViewIfNeeded();
          if(section==='engineering'){
            for(const company of ['Sweco','DataCamp','KNOQS','KU Leuven']){
              const row=page.locator('.experience').filter({has:page.getByRole('heading',{name:company,exact:true})});
              await row.hover();
              await page.waitForTimeout(500);
              assert.equal(await row.locator('.experience-logo').evaluate(el=>getComputedStyle(el).opacity),'1');
              assert(await row.locator('.experience-logo').evaluate(el=>el.complete && el.naturalWidth>0));
              await row.screenshot({path:`qa/${locale}-company-${company.toLowerCase()}.png`});
            }
          }
          await page.locator(`#${section} img`).evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
          await page.screenshot({path:`qa/${locale}-${section}.png`});
          if(section==='recognition'){
            await page.locator('.awards li').first().hover();
            await page.waitForTimeout(600);
            assert.notEqual(await page.locator('.award-star').first().evaluate(el=>getComputedStyle(el).transform),'none');
            await page.screenshot({path:`qa/${locale}-recognition-hover.png`});
          }
        }
      }
      assert.equal(resourceErrors.length,0,resourceErrors.join('\n'));
      await page.locator(`[data-language="${locale==='en'?'zh':'en'}"]`).click();
      await page.waitForLoadState('networkidle');
      assert(page.url().endsWith('#contact'));
      await context.close();
    }
  }
  for(const javaScriptEnabled of [false,true]){
    const context=await browser.newContext({viewport:{width:360,height:740},javaScriptEnabled,reducedMotion:'reduce'});
    const page=await context.newPage();
    await page.goto(`${base}/en/`,{waitUntil:'networkidle'});
    await page.screenshot({path:`qa/en-${javaScriptEnabled?'reduced-motion':'no-js'}.png`});
    assert(await page.locator('#hero-title').isVisible());
    assert(await page.locator('#abstract h2').isVisible());
    assert.equal(await page.locator('#ink-canvas').evaluate(c=>c.classList.contains('ready')),false);
    await page.locator('#site-index summary').click();
    assert(await page.locator('.index-panel').isVisible());
    results.push({javaScriptEnabled,reducedMotion:true,passed:true});
    await context.close();
  }
} finally {
  await writeFile('qa/verification.json',JSON.stringify(results,null,2));
  await browser.close();
}
console.log(JSON.stringify(results.map(r=>({locale:r.locale,viewport:r.viewport,violations:r.violations?.length,passed:r.passed})),null,2));
if(results.some(r=>r.violations?.length))process.exitCode=1;
