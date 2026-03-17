import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',

  testMatch: [
    '**/*.spec.js',
    '**/*.test.js',
    '**/*.spec.ts',
    '**/*.test.ts'
  ],

  timeout: 60 * 1000,
  retries: 1,

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['./reporter/customReporter.js']
  ],

  outputDir: 'test-results'
});
