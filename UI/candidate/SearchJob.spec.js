import { test, expect } from '@playwright/test';
import { Login } from '../../Pages/Login.js';
import SearchJob from '../../Pages/SearchJob.js';

test('Search job by name and verify results', async ({ page }) => {
  const loginPage = new Login(page);
  const searchPage = new SearchJob(page);

  // Login
  await loginPage.goto();
  await loginPage.login('khurrramimran908@gmail.com', 'Tech@12345');
  await loginPage.clickSignIn();

  // Keywords to test (one by one)
  const keywords = ['software','react'];

  for (const keyword of keywords) {
    await searchPage.searchJob(keyword);

    const result = await searchPage.verifyResultsContain(keyword);
    expect(result).toBeTruthy();
  }
});
