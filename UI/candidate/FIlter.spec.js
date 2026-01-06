import { test} from '@playwright/test';
import { loadCredentials } from '../../support/candidateCredentials.js';
import { Login } from '../../Pages/Login.js';
import { FilterPage } from '../../Pages/Filter.js';


const candidate = loadCredentials()[0];

test('Apply all job filters together', async ({ page }) => {
  const login = new Login(page);
  const filter = new FilterPage(page);

  await login.goto();
  await login.login(candidate.email, candidate.password);
  await login.clickSignIn();
  await page.waitForURL('**/jobs');
  console.log('Candidate logged in successfully.');
  await filter.handleMaybeLaterIfPresent();
  await filter.applyAllFilters();
  console.log('✅ All filters applied successfully');
});
