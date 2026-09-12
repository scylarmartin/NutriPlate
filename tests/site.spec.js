import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

mkdirSync('docs/qa', { recursive: true });
const routes = ['/', '/recipes', '/recipes/harvest-salad', '/meal-plans', '/nutrition', '/contact'];
for (const width of [390, 1440]) for (const route of routes) {
  test(`accessible and responsive: ${route} at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/#${route}`);
    await expect(page.locator('h1')).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    for (const image of await page.locator('main img').all()) { await image.scrollIntoViewIfNeeded(); await expect(image).toHaveJSProperty('complete', true); }
    await page.evaluate(() => window.scrollTo(0, 0));
    const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    const name = `${route.replaceAll('/', '-') || 'home'}-${width}`;
    writeFileSync(`docs/qa/axe${name}.json`, JSON.stringify({ url: audit.url, timestamp: audit.timestamp, violations: audit.violations, incomplete: audit.incomplete, passes: audit.passes.length }, null, 2));
    await page.screenshot({ path: `docs/qa/page${name}.png`, fullPage: true });
    expect(audit.violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}

test('keyboard skip link, mobile navigation, and route focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 850 });
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  // Start from a fresh page. Clicking the body changes Chrome's sequential
  // focus starting point and no longer represents keyboard-only entry.
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Recipes', exact: true }).click();
  await expect(page.locator('h1')).toBeFocused();
  await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveAttribute('aria-expanded', 'false');
});

test('search and filter, details, and browser refresh', async ({ page }) => {
  await page.goto('/#/recipes');
  await page.getByRole('searchbox').fill('quinoa');
  await expect(page.getByRole('status')).toHaveText('1 recipe for “quinoa”');
  await page.getByRole('link', { name: /Lemon salmon & quinoa/ }).click();
  await expect(page.locator('h1')).toHaveText('Lemon salmon & quinoa');
  await page.reload();
  await expect(page.locator('h1')).toHaveText('Lemon salmon & quinoa');
  await page.getByRole('checkbox').first().check();
  await expect(page.getByRole('checkbox').first()).toBeChecked();
  await page.emulateMedia({ media: 'print' });
  await expect(page.getByRole('heading', { name: 'What you’ll need' })).toBeVisible();
  await expect(page.locator('.site-header')).toBeHidden();
});

test('all recipe images load and tablet layout has no overflow', async ({ page }) => {
  for (const width of [600, 900, 1200]) {
    await page.setViewportSize({ width, height: 950 });
    await page.goto('/#/recipes');
    for (const image of await page.locator('main img').all()) { await image.scrollIntoViewIfNeeded(); await expect(image).toHaveJSProperty('complete', true); expect(await image.evaluate(img => img.naturalWidth)).toBeGreaterThan(0); }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('contact errors, validation, and local-only success', async ({ page }) => {
  await page.goto('/#/contact');
  const requests = []; page.on('request', req => { if (req.method() === 'POST') requests.push(req.url()); });
  await page.getByRole('button', { name: 'Check message' }).click();
  await expect(page.getByRole('alert')).toBeFocused();
  await page.getByLabel('Your name *').fill('Alex');
  await page.getByLabel('Email address *').fill('alex@example.com');
  await page.getByLabel('Your message *').fill('Please add more easy lunch ideas.');
  await page.getByRole('button', { name: 'Check message' }).click();
  await expect(page.getByRole('status')).toBeFocused();
  await expect(page.getByRole('status')).toContainText('not sent or saved');
  expect(requests).toEqual([]);
});

test('all recipes remain readable with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/');
  await page.getByRole('link', { name: 'Read all recipes, ingredients, and cooking instructions' }).click();
  await expect(page.locator('article')).toHaveCount(12);
  await expect(page.locator('article').first().getByRole('heading', { name: 'Method' })).toBeVisible();
  await context.close();
});

test('200% text enlargement preserves readable layout', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto('/#/recipes');
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  await page.screenshot({ path: 'docs/qa/text-200-percent.png', fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('progressive WebMCP tool updates the same filters and rejects invalid input', async ({ page }) => {
  await page.addInitScript(() => {
    window.registeredTools = {};
    Object.defineProperty(document, 'modelContext', { value: { registerTool(tool, { signal } = {}) { window.registeredTools[tool.name] = tool; signal?.addEventListener('abort', () => { if (window.registeredTools[tool.name] === tool) delete window.registeredTools[tool.name]; }); } } });
  });
  await page.goto('/#/recipes');
  await page.waitForFunction(() => Boolean(window.registeredTools.filter_nutriplate_recipes));
  const result = await page.evaluate(() => window.registeredTools.filter_nutriplate_recipes.execute({ q: 'quinoa' }));
  expect(result.count).toBe(1);
  await expect(page.getByRole('searchbox')).toHaveValue('quinoa');
  await expect(page.getByRole('status')).toContainText('1 recipe');
  const invalid = await page.evaluate(() => { try { window.registeredTools.filter_nutriplate_recipes.execute({ diet: 'invalid' }); return false; } catch { return true; } });
  expect(invalid).toBe(true);
  await expect(page.getByRole('status')).toContainText('1 recipe');
});
