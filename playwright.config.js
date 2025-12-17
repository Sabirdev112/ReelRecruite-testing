import { defineConfig } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: '.', // root directory for your tests
  testMatch: [
    '**/*.spec.js',
    '**/*.test.js',
    '**/*.spec.ts',
    '**/*.test.ts'
  ],

  timeout: 120 * 1000, // 2 minutes per test
  retries: 0,

  use: {
    trace: 'on-first-retry',
    headless: false, // optional: run in headed mode for debugging
    viewport: { width: 1280, height: 720 },
    actionTimeout: 30 * 1000,
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],

  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],

  outputDir: 'test-results',

  // Make sure ES modules are supported
  // This ensures top-level await works in your spec files
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
});
