import { test } from '@playwright/test';
import { loadCandidateCredentials } from '../../support/candidateCredentials.js';
import { Login } from '../../Pages/Login.js';
import { FilterPage } from '../../Pages/Filter.js';


const candidate = loadCandidateCredentials()[0];

test('Apply Work Type filter', async ({ page }) => {
  const login = new Login(page);
  const filter = new FilterPage(page);

  await login.goto();
  await login.login(candidate.email, candidate.password);
  await login.clickSignIn();
  await page.waitForURL('**/jobs');
  
  await filter.applyWorkTypeFilter();
  
});
