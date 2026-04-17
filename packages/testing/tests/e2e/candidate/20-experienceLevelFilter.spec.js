import { test } from '../../fixtures/base.fixtures.js';
import { loadCredentials } from '../../utils/candidateCredentials.js';



const candidate = loadCredentials()[0];

test('Apply Experience Level filter', async ({ page, loginPage, filter }) => {
  
  

  await loginPage.goto();
  await loginPage.login(candidate.email, candidate.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/jobs');
 
  await filter.applyExperienceLevelFilter();
});


