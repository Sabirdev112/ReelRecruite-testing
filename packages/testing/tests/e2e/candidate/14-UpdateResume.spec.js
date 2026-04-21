import { test, expect } from '../../fixtures/base.fixtures.js';
import { loadCredentials } from '../../utils/candidateCredentials.js';
import { getCandidateProfileByEmail, getCandidateResumeUrl } from '../../utils/candidateDb.helper.js';

const candidate = loadCredentials()[0];

test('Candidate deletes and uploads resume', async ({ page, loginPage, changeResume }) => {
  
  await loginPage.goto();
  await loginPage.login(candidate.email, candidate.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/jobs');
  await changeResume.clickProfileMenu();
  await changeResume.goToProfile();
  await changeResume.navigateToResumeSection();
  await changeResume.deleteExistingResume();
  await changeResume.confirmDelete();
  await changeResume.uploadNewResume(); 
  
  // Verify DB
  const profile = await getCandidateProfileByEmail(candidate.email);
  expect(profile).toBeTruthy();
  const resume = await getCandidateResumeUrl(profile.user_id);
  expect(resume).toBeTruthy();
});


