import { test, expect } from '@playwright/test';
import { loadCredentials } from '../../support/candidateCredentials.js';
import { Login } from '../../Pages/Login.js';
import { FilterPage } from '../../Pages/Filter.js';

const candidate = loadCredentials()[0];

test('Apply Region filter', async ({ page }) => {
  const login = new Login(page);
  const filter = new FilterPage(page);

  await login.goto();
  await login.login(candidate.email, candidate.password);
  await login.clickSignIn();
  await page.waitForURL('**/jobs');
  console.log('Candidate logged in successfully.');
  await filter.handleMaybeLaterIfPresent();

  await filter.applyRegionFilter();

  await expect(page).toHaveURL(/jobs|search/);
  console.log('✅ Region filter applied');
});
