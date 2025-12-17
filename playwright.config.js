import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: '.',
  testMatch: [
    '**/*.spec.ts',
    '**/*.spec.js',
    '**/*.test.ts',
    '**/*.test.js'
  ],
  timeout: 0 * 1000,
  retries: 0,
  use: {
    trace: 'on-first-retry'
  },
  projects: [
  {
    name: 'Chromium',
    testDir: './UI',
    use: { browserName: 'chromium', headless: false }
  },
  {
    name: 'API',
    testDir: './API',
    use: { browserName: 'chromium', headless: true }
  }
],
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  outputDir: 'test-results'
});