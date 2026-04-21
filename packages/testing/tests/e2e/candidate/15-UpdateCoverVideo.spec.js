import { test, expect } from '../../fixtures/base.fixtures.js';
import { loadCredentials } from '../../utils/candidateCredentials.js';
import { getCandidateProfileByEmail, getCandidateCoverVideo } from '../../utils/candidateDb.helper.js';

const candidate = loadCredentials()[0];

  test('candidate can upload a video resume', async ({ page, loginPage, uploadCoverVideo }) => {
  
  await loginPage.goto();
  await loginPage.login(candidate.email, candidate.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/jobs');

  await uploadCoverVideo.clickProfile();
  await uploadCoverVideo.openProfile();
  await uploadCoverVideo.navigateToCoverVideoSection();
  await uploadCoverVideo.removeVideoIfExists();
  await uploadCoverVideo.uploadVideo();
  
  // Verify DB
  const profile = await getCandidateProfileByEmail(candidate.email);
  expect(profile).toBeTruthy();

});




