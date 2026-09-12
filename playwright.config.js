import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['json', { outputFile: 'docs/qa/browser-test-results.json' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    channel: existsSync('/Applications/Google Chrome.app') ? 'chrome' : undefined,
    headless: true,
    screenshot: 'only-on-failure',
  },
  webServer: { command: 'npm run preview -- --port 4173 --strictPort', url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI },
});
