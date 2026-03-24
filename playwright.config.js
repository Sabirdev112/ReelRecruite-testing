import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars for all contexts
dotenv.config();

export default defineConfig({
  testDir: './tests', // Root of all specimen categories

  testMatch: [
    '**/*.spec.js',
    '**/*.test.js',
  ],

  // Grouping specimens by folder logic in reporter
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['./reporter/customReporter.js']
  ],

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  timeout: 60 * 1000,
  retries: 1,
  outputDir: 'test-results',
});
