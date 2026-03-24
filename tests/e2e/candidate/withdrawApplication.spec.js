import { test } from '../../fixtures/base.fixtures.js';


import { loadCredentials } from '../../utils/candidateCredentials.js';
import { getApplicationId, buildApplicationUrl } from '../../utils/application.helper.js';
import { verifyApplicationWithdrawn } from '../../utils/applicationDb.helper.js';

const candidate = loadCredentials()[0];
const applicationId = getApplicationId();

test('Candidate withdraw application', async ({ page, loginPage, withdrawApplication }) => {
  
  

  await loginPage.goto();
  await loginPage.login(candidate.email, candidate.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/jobs');

  const applicationUrl = buildApplicationUrl(applicationId);
  await page.goto(applicationUrl);
  await withdrawApplication.withdraw();
  await withdrawApplication.confirmWithdraw();

  // DB verification
  const verifiedApplicationId = await verifyApplicationWithdrawn(candidate.email, applicationId);
});


