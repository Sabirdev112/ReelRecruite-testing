import { test } from '@playwright/test';
import { loadCandidateCredentials } from '../../support/candidateCredentials.js';
import { Login } from '../../Pages/Login.js';
import { UploadResume } from '../../Pages/ChangeResume.js';

// Load candidate credentials
const candidate = loadCandidateCredentials()[0];

test('Candidate deletes and uploads resume', async ({ page }) => {
  const loginPage = new Login(page);
  const uploadResumePage = new UploadResume(page);

  // ----------- Login -----------
  await loginPage.goto();
  await loginPage.login(candidate.email, candidate.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/jobs');
  console.log('Candidate logged in successfully.');
  await uploadResumePage.handleMaybeLaterIfPresent();

  // ----------- Profile & Resume flow -----------
  await uploadResumePage.clickProfileMenu();
  await uploadResumePage.goToProfile();
  await uploadResumePage.navigateToResumeSection();
  console.log('Navigated to Resume section.');

  await uploadResumePage.deleteExistingResume();
  await uploadResumePage.confirmDelete();
  console.log('Existing resume deleted.');

  // Upload new resume (uses helper internally)
  await uploadResumePage.uploadNewResume(); 
  console.log('New resume uploaded.');
});
