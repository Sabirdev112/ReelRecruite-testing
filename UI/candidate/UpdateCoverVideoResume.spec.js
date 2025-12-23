import { test, expect } from '@playwright/test';
import { Login } from '../../Pages/Login.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import {UpdateCoverVideoResumePage} from '../../Pages/UploadCoverVideo.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const candidate = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../fixtures/Candidate/Credentials.json'),
    'utf-8'
  )
)[0];

const VideoPath = path.join(
  __dirname,
  '../../fixtures/sample-video.mp4'
);


  

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

  await coverVideoPage.uploadVideo(VideoPath);
  console.log('Video uploaded successfully.');

});


