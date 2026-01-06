import { test } from '@playwright/test';
import { Login } from '../../Pages/Login.js';
import { withdrawPage } from '../../Pages/withdrawApplication.js';
import { loadCandidateCredentials } from '../../support/candidateCredentials.js';
import { getApplicationId, buildApplicationUrl } from '../../support/application.helper.js';
import { verifyApplicationWithdrawn } from '../../support/applicationDb.helper.js';

const candidate = loadCandidateCredentials()[0];
const applicationId = getApplicationId();

test('Candidate withdraw application', async ({ page }) => {
  const loginPage = new Login(page);
  const withdrawApplication = new withdrawPage(page);
 
  console.log(`Processing user: ${candidate.email}`);

  // LOGIN
  await loginPage.goto();
  await loginPage.login(candidate.email, candidate.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/jobs');
  console.log('Candidate logged in successfully.');
  await withdrawApplication.handleMaybeLaterIfPresent();

//   withdraw application
  const applicationUrl = buildApplicationUrl(applicationId);
  await page.goto(applicationUrl);
  console.log(`Successfully navigated to Application URL: ${applicationUrl}`);
  await withdrawApplication.withdraw();
  await withdrawApplication.confirmWithdraw();
  console.log(`Withdrawn application for: ${candidate.email}`);

  // DB verification
  const verifiedApplicationId = await verifyApplicationWithdrawn(candidate.email, applicationId);
  console.log(`DB verification passed: Application ${verifiedApplicationId} is withdrawn for ${candidate.email}`);
});
