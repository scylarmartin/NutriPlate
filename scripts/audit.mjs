import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const route = process.argv.find(arg => arg.startsWith('--route='))?.slice(8) || '/';
const port = 4174;
const origin = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], { stdio: ['ignore', 'ignore', 'pipe'] });
let serverError = '';
server.stderr.on('data', chunk => { serverError += chunk; });
let chrome;
try {
  for (let attempt = 0; attempt < 50; attempt++) {
    if (server.exitCode !== null) throw new Error(`Preview could not start: ${serverError}`);
    try { if ((await fetch(origin)).ok) break; } catch { /* Wait for Vite. */ }
    if (attempt === 49) throw new Error('Preview did not respond.');
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  const chromePath = process.env.CHROME_PATH || (existsSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome') ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : undefined);
  chrome = await chromeLauncher.launch({ chromePath, chromeFlags: ['--headless=new', '--disable-gpu'] });
  const result = await lighthouse(`${origin}/#${route}`, { port: chrome.port, output: ['html', 'json'], logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'], formFactor: 'mobile' });
  mkdirSync('docs/qa', { recursive: true });
  const slug = route.replaceAll('/', '-').replace(/^-|-$/g, '') || 'home';
  writeFileSync(`docs/qa/lighthouse-${slug}.html`, result.report[0]);
  writeFileSync(`docs/qa/lighthouse-${slug}.json`, result.report[1]);
  const summary = {
    route, timestamp: result.lhr.fetchTime,
    environment: 'Local production preview, Chrome headless, Lighthouse mobile simulation',
    scores: Object.fromEntries(Object.entries(result.lhr.categories).map(([key, value]) => [key, Math.round(value.score * 100)])),
    metrics: Object.fromEntries(['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift'].map(key => [key, result.lhr.audits[key]?.displayValue])),
    failedAudits: Object.values(result.lhr.audits).filter(audit => audit.score !== null && audit.score < 1).map(({ id, title, score, displayValue }) => ({ id, title, score, displayValue })),
  };
  writeFileSync(`docs/qa/lighthouse-${slug}-summary.json`, JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
} finally {
  await chrome?.kill();
  server.kill('SIGTERM');
}
