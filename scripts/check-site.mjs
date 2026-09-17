import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { access, mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'test-results');
const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
const results = [];
const runtimeErrors = [];
await mkdir(output, { recursive: true });

async function exists(file) {
  try { await access(file); return true; } catch { return false; }
}

async function browserExecutable() {
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE) return process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
  if (await exists(chromium.executablePath())) return chromium.executablePath();
  const cache = process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'ms-playwright');
  if (cache && await exists(cache)) {
    const versions = (await readdir(cache)).filter((name) => /^chromium-\d+$/.test(name)).sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]));
    for (const version of versions) {
      const executable = path.join(cache, version, 'chrome-win64', 'chrome.exe');
      if (await exists(executable)) return executable;
    }
  }
  return undefined;
}

let browser;
let page;

async function check(name, action) {
  const start = Date.now();
  try {
    await action();
    results.push({ name, passed: true, durationMs: Date.now() - start });
    console.log(`PASS ${name}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    results.push({ name, passed: false, durationMs: Date.now() - start, error: message });
    console.error(`FAIL ${name}: ${message}`);
    if (page) await page.screenshot({ path: path.join(output, `failure-${results.length}.png`), fullPage: true }).catch(() => {});
  }
}

async function loadPage(width = 1440, colorScheme = 'light') {
  await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
  await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
  const response = await page.goto(baseUrl, { waitUntil: 'networkidle' });
  assert.equal(response?.status(), 200, 'Homepage must return HTTP 200');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}

async function loadLazyImages() {
  const images = page.locator('img');
  for (let index = 0; index < await images.count(); index++) {
    const image = images.nth(index);
    if (await image.isVisible()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((node) => node.complete && node.naturalWidth > 0), { timeout: 10000 }).toBe(true);
    }
  }
}

try {
  const executablePath = await browserExecutable();
  browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, locale: 'en-IN' });
  // This captures the prepared URL without opening WhatsApp or sending a message.
  await context.addInitScript(() => {
    window.__testOpenedUrls = [];
    window.open = (url) => { window.__testOpenedUrls.push(String(url)); return null; };
  });
  page = await context.newPage();
  page.setDefaultTimeout(12000);
  page.on('pageerror', (error) => runtimeErrors.push(error.message));

  await check('Business identity, contact links and price-free content', async () => {
    await loadPage();
    await expect(page).toHaveTitle(/Hotel and Resturant Furniture.*Vijayawada/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByRole('heading', { name: /find your kind of furniture/i })).toBeVisible();
    const phoneLinks = page.locator('a[href="tel:+918639121227"]');
    assert.ok(await phoneLinks.count() >= 3, 'Visitors should be able to call from several page sections');
    for (const link of await phoneLinks.all()) {
      if (await link.isVisible()) await expect(link).toContainText('+91 8639121227');
    }
    const whatsAppLinks = page.locator('a[href^="https://wa.me/918639121227"]');
    for (const link of await whatsAppLinks.all()) {
      if (await link.isVisible()) await expect(link).toContainText('+91 8639121227');
    }
    const content = await page.locator('body').innerText();
    assert.doesNotMatch(content, /₹|\bINR\s*\d|\bRs\.?\s*\d|\bprices?\b/i, 'Do not display prices or price claims');
    assert.match(content, /Vijayawada/);
    assert.match(content, /Vizag/);
    assert.match(content, /Hyderabad/);
  });

  await check('Furniture filtering and expanded collection', async () => {
    await loadPage();
    const collection = page.getByRole('region', { name: 'Find your kind of furniture.' });
    const cards = collection.getByRole('article');
    await expect(cards).toHaveCount(6);
    await page.getByRole('button', { name: 'View all furniture', exact: true }).click();
    await expect(cards).toHaveCount(7);
    await expect(page.getByRole('button', { name: 'Show fewer designs' })).toBeFocused();
    await page.getByRole('button', { name: 'Chairs & seating', exact: true }).click();
    await expect(cards).toHaveCount(1);
    await expect(cards.first().getByRole('heading')).toHaveText('Upholstered accent chairs');
    await page.getByRole('button', { name: 'Tables & benches', exact: true }).click();
    await expect(cards).toHaveCount(1);
    await expect(cards.first().getByRole('heading')).toHaveText('Table & bench set');
    await page.getByRole('button', { name: 'Dining sets', exact: true }).click();
    await expect(cards).toHaveCount(5);
    await page.getByRole('button', { name: 'All furniture', exact: true }).click();
    await expect(cards).toHaveCount(6);
    await expect(page.getByRole('button', { name: 'All furniture', exact: true })).toHaveAttribute('aria-pressed', 'true');
  });

  await check('Furniture dialog, next/previous, Escape and return focus', async () => {
    await loadPage();
    const opener = page.getByRole('button', { name: 'View upholstered dining set', exact: true });
    await opener.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading')).toHaveText('Upholstered dining set');
    await expect(dialog.getByRole('link', { name: /Enquire on WhatsApp/ })).toContainText('+91 8639121227');
    const whatsappUrl = new URL(await dialog.getByRole('link', { name: /Enquire on WhatsApp/ }).getAttribute('href'));
    assert.match(whatsappUrl.searchParams.get('text'), /Upholstered dining set/);
    await dialog.getByRole('button', { name: 'Next furniture design' }).click();
    await expect(dialog.getByRole('heading')).toHaveText('Classic metal dining set');
    await page.keyboard.press('ArrowLeft');
    await expect(dialog.getByRole('heading')).toHaveText('Upholstered dining set');
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(opener).toBeFocused();
    await opener.click();
    await page.mouse.click(5, 5);
    await expect(dialog).not.toBeVisible();
    await expect(opener).toBeFocused();
  });

  await check('Mobile navigation opens, closes and supports Escape', async () => {
    await loadPage(375);
    const opener = page.getByRole('button', { name: 'Open menu', exact: true });
    await opener.click();
    const navigation = page.getByRole('navigation', { name: 'Mobile navigation' });
    await expect(navigation).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(navigation).not.toBeVisible();
    await expect(opener).toBeFocused();
    await opener.click();
    await navigation.getByRole('link', { name: 'Our collection' }).click();
    await expect(navigation).not.toBeVisible();
    assert.equal(new URL(page.url()).hash, '#categories');
  });

  await check('Frequently asked questions expand and collapse', async () => {
    await loadPage();
    const detail = page.locator('details').first();
    const summary = detail.locator('summary');
    await expect(detail.locator('p')).not.toBeVisible();
    await summary.click();
    await expect(detail.locator('p')).toBeVisible();
    await expect(detail.locator('p')).toContainText('restaurant sofas');
    await summary.press('Enter');
    await expect(detail.locator('p')).not.toBeVisible();
  });

  await check('Enquiry validation and composed WhatsApp message', async () => {
    await loadPage();
    const name = page.getByRole('textbox', { name: 'Your name', exact: true });
    const submit = page.getByRole('button', { name: 'WhatsApp +91 8639121227', exact: true });
    await submit.click();
    assert.equal(await name.evaluate((node) => node.validity.valueMissing), true);
    assert.equal(await page.evaluate(() => window.__testOpenedUrls.length), 0);
    await name.fill('   ');
    await submit.click();
    await expect(page.getByRole('alert').filter({ hasText: 'Please enter your name.' })).toBeVisible();
    await expect(name).toBeFocused();
    assert.equal(await page.evaluate(() => window.__testOpenedUrls.length), 0);
    await name.fill('  Test Visitor  ');
    await page.getByRole('combobox', { name: 'Your space' }).selectOption({ label: 'Café' });
    await page.getByRole('combobox', { name: 'Your city' }).selectOption({ label: 'Hyderabad' });
    await page.getByRole('textbox', { name: /What do you have in mind/ }).fill('6 tables & 24 chairs. Please share available colours.');
    await submit.click();
    const opened = await page.evaluate(() => window.__testOpenedUrls);
    assert.equal(opened.length, 1);
    const url = new URL(opened[0]);
    assert.equal(url.origin, 'https://wa.me');
    assert.equal(url.pathname, '/918639121227');
    const message = url.searchParams.get('text');
    assert.match(message, /Test Visitor/);
    assert.match(message, /café in Hyderabad/);
    assert.match(message, /6 tables & 24 chairs/);
    assert.doesNotMatch(message, /  Test Visitor  /);
    await expect(page.getByRole('status').filter({ hasText: 'Your message is ready' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Continue in WhatsApp' })).toHaveAttribute('href', url.href);
  });

  await check('Local SEO data matches the real business location', async () => {
    await loadPage();
    const data = await page.locator('script[type="application/ld+json"]').allTextContents();
    const entities = data.flatMap((text) => {
      const parsed = JSON.parse(text);
      return parsed['@graph'] || (Array.isArray(parsed) ? parsed : [parsed]);
    });
    const business = entities.find((entity) => entity['@type'] === 'FurnitureStore');
    assert.ok(business, 'FurnitureStore structured data should exist');
    assert.equal(business.name, 'Hotel and Resturant Furniture');
    assert.equal(business.telephone, '+918639121227');
    assert.equal(business.address.addressLocality, 'Vijayawada');
    assert.equal(business.address.postalCode, '520015');
    assert.equal(business.geo.latitude, 16.546791076660156);
    assert.equal(business.geo.longitude, 80.64033508300781);
    assert.deepEqual(business.areaServed.map((city) => city.name), ['Vijayawada', 'Visakhapatnam', 'Hyderabad']);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Vijayawada.*Vizag.*Hyderabad/);
    assert.equal(business.priceRange, undefined);
    assert.equal(business.aggregateRating, undefined);
  });

  await check('All furniture and room photographs load', async () => {
    await loadPage();
    await page.getByRole('button', { name: 'View all furniture', exact: true }).click();
    await loadLazyImages();
    const images = await page.locator('img').evaluateAll((nodes) => nodes.filter((node) => node.getBoundingClientRect().width > 0).map((node) => ({ src: node.currentSrc, alt: node.alt, loaded: node.complete && node.naturalWidth > 0 })));
    assert.ok(images.length >= 10, 'The hero, seven collection photos and two room photos should be present');
    assert.ok(images.every((image) => image.loaded), JSON.stringify(images.filter((image) => !image.loaded)));
    assert.ok(images.every((image) => image.alt.trim()), 'Every photograph needs descriptive alt text');
    assert.ok(images.every((image) => image.src.startsWith(new URL(baseUrl).origin)), 'Photography should be locally hosted');
  });

  for (const width of [320, 375, 768, 1024, 1440]) {
    await check(`No horizontal overflow at ${width}px`, async () => {
      await loadPage(width);
      const overflow = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, page: document.documentElement.scrollWidth, offenders: [...document.querySelectorAll('body *')].filter((element) => { const box = element.getBoundingClientRect(); return box.width > 0 && box.right > window.innerWidth + 1 && getComputedStyle(element).position !== 'fixed'; }).slice(0, 8).map((element) => `${element.tagName}.${element.className}`) }));
      assert.ok(overflow.page <= overflow.viewport + 1, JSON.stringify(overflow));
    });
  }

  for (const colorScheme of ['light', 'dark']) {
    for (const width of [375, 1440]) {
      await check(`WCAG A/AA accessibility, ${colorScheme} at ${width}px`, async () => {
        await loadPage(width, colorScheme);
        await loadLazyImages();
        await page.evaluate(() => window.scrollTo(0, 0));
        const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
        await writeFile(path.join(output, `axe-${colorScheme}-${width}.json`), JSON.stringify(scan, null, 2));
        const violations = scan.violations.map((violation) => ({ id: violation.id, impact: violation.impact, description: violation.description, elements: violation.nodes.map((node) => ({ target: node.target, failure: node.failureSummary })) }));
        assert.deepEqual(violations, [], JSON.stringify(violations, null, 2));
      });
    }
  }

  await check('Dialog accessibility', async () => {
    await loadPage();
    await page.getByRole('button', { name: 'View upholstered dining set', exact: true }).click();
    const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    await writeFile(path.join(output, 'axe-dialog.json'), JSON.stringify(scan, null, 2));
    assert.deepEqual(scan.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(({ target }) => target) })), []);
    await page.keyboard.press('Escape');
  });

  await check('Desktop and mobile screenshots', async () => {
    for (const [name, width] of [['desktop', 1440], ['mobile', 375]]) {
      await loadPage(width);
      await loadLazyImages();
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: path.join(output, `${name}-first-fold.png`) });
      await page.screenshot({ path: path.join(output, `${name}-full.png`), fullPage: true });
    }
  });

  await check('No browser runtime errors', async () => {
    assert.deepEqual([...new Set(runtimeErrors)], []);
  });
} catch (error) {
  results.push({ name: 'Browser test setup', passed: false, error: error instanceof Error ? error.stack : String(error) });
  console.error(error);
} finally {
  await browser?.close();
  const failed = results.filter((result) => !result.passed);
  const report = { baseUrl, testedAt: new Date().toISOString(), passed: results.length - failed.length, failed: failed.length, results };
  await writeFile(path.join(output, 'verification.json'), JSON.stringify(report, null, 2));
  console.log(`${report.passed} passed; ${report.failed} failed. Report: ${path.join(output, 'verification.json')}`);
  if (failed.length) process.exitCode = 1;
}
