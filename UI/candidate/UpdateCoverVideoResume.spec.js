import { test, expect } from '@playwright/test';
import { Login } from '../../Pages/Login.js';
import { loadCandidateCredentials } from '../../support/candidateCredentials.js';
import {UpdateCoverVideoResumePage} from '../../Pages/UploadCoverVideo.js';


const candidate = loadCandidateCredentials()[0];
  

  test('candidate can upload a video resume', async ({ page }) => {
  const loginPage = new Login(page);
  const coverVideoPage = new UpdateCoverVideoResumePage(page);

  await loginPage.goto();
  await loginPage.login(candidate.email, candidate.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/jobs');
  console.log('Candidate logged in successfully.');
  await coverVideoPage.handleMaybeLaterIfPresent();

  await coverVideoPage.clickProfile();
  await coverVideoPage.openProfile();

  await coverVideoPage.navigateToCoverVideoSection();
  await coverVideoPage.removeVideoIfExists();
  console.log('Existing video removed if present.');

  await coverVideoPage.uploadVideo();
  console.log('Video uploaded successfully.');

});


