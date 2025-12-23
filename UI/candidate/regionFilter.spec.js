import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Login } from '../../Pages/Login.js';
import { FilterPage } from '../../Pages/Filter.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load recruiter credentials
const candidate = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../fixtures/Candidate/Credentials.json'),
    'utf-8'
  )
)[0];


test('Apply Region filter', async ({ page }) => {
  const login = new Login(page);
  const filter = new FilterPage(page);

  await login.goto();
  await login.login(candidate.email, candidate.password);
  await login.clickSignIn();
  await page.waitForLoadState('networkidle');

  await filter.applyRegionFilter();

  await expect(page).toHaveURL(/jobs|search/);
  console.log('✅ Region filter applied');
});
