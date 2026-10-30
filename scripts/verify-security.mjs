import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = (process.env.TEST_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  for (const route of ['en/', 'zh/', 'cv/', '']) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.cspViolations = [];
      document.addEventListener('securitypolicyviolation', event => {
        window.cspViolations.push(event.effectiveDirective);
      });
    });
    const response = await page.goto(`${base}/${route}`, { waitUntil: 'networkidle' });
    // Redirect pages navigate immediately (the CV ultimately opens a PDF).
    if (route === '' || route === 'cv/') {
      const html = await (await context.request.get(`${base}/${route}`)).text();
      assert.match(html, /name="robots" content="noindex, nofollow/);
      assert.match(html, /http-equiv="content-security-policy"/);
    } else {
      assert.equal(response.status(), 200);
      assert.match(await page.locator('meta[name="robots"]').getAttribute('content'), /noindex/);
      assert.doesNotMatch(await page.locator('body').innerText(), /\{\{[^}]+\}\}|待补充|forthcoming/i);
      assert.equal(await page.locator('.toolkit-group').count(), 5);
      const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
      assert.equal(schema.email, undefined);
      assert.equal(schema.telephone, undefined);
      await page.waitForSelector('#ink-canvas.ready');
      assert.deepEqual(await page.evaluate(() => window.cspViolations), [], 'Legitimate content blocked');
      // An injected inline script and event handler must both be refused.
      await page.evaluate(() => {
        const script = document.createElement('script');
        script.textContent = 'window.injectedScriptRan = true';
        document.body.append(script);
        const button = document.createElement('button');
        button.setAttribute('onclick', 'window.injectedHandlerRan = true');
        document.body.append(button);
        button.click();
      });
      await page.waitForFunction(() => window.cspViolations.length >= 2);
      assert.equal(await page.evaluate(() => window.injectedScriptRan), undefined);
      assert.equal(await page.evaluate(() => window.injectedHandlerRan), undefined);
    }
    await context.close();
    console.log(`Security checks passed: /${route}`);
  }
  const context = await browser.newContext();
  const robots = await context.request.get(`${base}/robots.txt`);
  assert.equal(robots.status(), 200);
  assert.match(await robots.text(), /User-agent: \*\s+Disallow: \//);
  await context.close();
} finally {
  await browser.close();
}
