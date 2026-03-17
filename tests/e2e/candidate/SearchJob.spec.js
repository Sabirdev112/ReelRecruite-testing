import { test, expect } from '../../fixtures/base.fixtures.js';
import { loadCredentials } from '../../utils/candidateCredentials.js';



const candidate = loadCredentials()[0];

test('Search job by name and verify results', async ({ page, loginPage, searchJob }) => {
  
  
  await loginPage.goto();
  await loginPage.login(candidate.email, candidate.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/jobs');

  const keywords = ['software','react'];

  for (const keyword of keywords) {
    await searchJob.searchJob(keyword);
  }
});


