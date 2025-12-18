import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { Login } from '../../Pages/Login.js';
import { UploadResume } from '../../Pages/ChangeResume.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load candidate credentials
const candidate = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../fixtures/Candidate/Credentials.json'),
    'utf-8'
  )
)[0];

// Resume file path
const resumePath = path.join(
  __dirname,
  '../../fixtures/Bold-Poster.pdf'
);

test('Candidate deletes and uploads resume', async ({ page }) => {
  // ----------- Login -----------
  const loginPage = new Login(page);
   const uploadResumePage = new UploadResume(page);
  await loginPage.goto();
  await loginPage.login(candidate.email, candidate.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/jobs');
  await uploadResumePage.handleMaybeLaterIfPresent();

  // ----------- Profile & Resume flow -----------
 

  await uploadResumePage.clickProfileMenu();
  await uploadResumePage.goToProfile();

  await uploadResumePage.navigateToResumeSection();
  console.log('Navigated to Resume section.');
  await uploadResumePage.deleteExistingResume();
  console.log('Existing resume deleted if it was present.');
  await uploadResumePage.confirmDelete();
  console.log('Confirmed resume deletion.');

  await uploadResumePage.uploadNewResume(resumePath);
  console.log('New resume uploaded.');
});
