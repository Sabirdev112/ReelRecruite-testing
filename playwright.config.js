import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Allow Playwright to discover tests anywhere
  testDir: '.',

  // Only treat proper test files as tests
  testMatch: [
    '**/*.spec.js',
    '**/*.test.js',
    '**/*.spec.ts',
    '**/*.test.ts'
  ],

  timeout: 120 * 1000,

  retries: 0,
  use: {
    // baseURL intentionally removed
    trace: 'on-first-retry'
  },

  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],

  outputDir: 'test-results'
});