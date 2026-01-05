import { test, expect } from '@playwright/test';
import { loadCredentials } from '../../support/candidateCredentials.js';
import { Login } from '../../Pages/Login.js';
import SearchJob from '../../Pages/SearchJob.js';

const candidate = loadCredentials()[0];

test('Search job by name and verify results', async ({ page }) => {
  const loginPage = new Login(page);
  const searchPage = new SearchJob(page);

  // Login
  await loginPage.goto();
  await loginPage.login(candidate.email, candidate.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/jobs');
  console.log('Candidate logged in successfully.');

  await searchPage.handleMaybeLaterIfPresent();

  // Keywords to test (one by one)
  const keywords = ['software','react'];

  for (const keyword of keywords) {
    await searchPage.searchJob(keyword);

    const result = await searchPage.verifyResultsContain(keyword);
    expect(result).toBeTruthy();
    console.log(`Searched for "${keyword}" and found results: ${result}`);
  }
});
