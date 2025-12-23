import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Login } from '../../Pages/Login.js';
import SearchJob from '../../Pages/SearchJob.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load recruiter credentials
const candidate = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../fixtures/Candidate/Credentials.json'),
    'utf-8'
  )
)[0];


test('Search job by name and verify results', async ({ page }) => {
  const loginPage = new Login(page);
  const searchPage = new SearchJob(page);

  // Login
  await loginPage.goto();
  await loginPage.login(candidate.email, candidate.password);
  await loginPage.clickSignIn();

  // Keywords to test (one by one)
  const keywords = ['software','react'];

  for (const keyword of keywords) {
    await searchPage.searchJob(keyword);

    const result = await searchPage.verifyResultsContain(keyword);
    expect(result).toBeTruthy();
  }
});
