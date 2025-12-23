import {test} from '@playwright/test';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {Login} from '../../Pages/Login.js';
import {UpdateInfoPage} from '../../Pages/UpdateInfo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Recruiter credentials
const recruiter = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../fixtures/Candidate/Credentials.json'),
    'utf-8'
  )
)[0];

// Logo path
const bannerPath = path.join(__dirname, '../../fixtures/logo.jpg');
const profilePath = path.join(__dirname, '../../fixtures/profile.png');

test('Candidate info, profile picture, and banner update', async ({ page }) => {
  // -------- Login --------
  const loginPage = new Login(page);
   const updateInfoPage = new UpdateInfoPage(page);
  await loginPage.goto();
  await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/jobs');
  console.log('Candidate logged in successfully.');

 

  await updateInfoPage.handleMaybeLaterIfPresent();
  await updateInfoPage.openProfileMenu();
  await updateInfoPage.clickProfile();
  await updateInfoPage.clickEditProfile();
  await updateInfoPage.uploadCoverImage(bannerPath);
  console.log('Cover image updated.');
  await updateInfoPage.uploadProfilePicture(profilePath);
  console.log('Profile picture updated.');
  await updateInfoPage.fillFullName('Sabir SQA');
  console.log('Full name updated.');
  await updateInfoPage.fillProfessionalTitle('Senior QA Engineer');
  console.log('Professional title updated.');
  await updateInfoPage.clickSaveChanges();
  console.log('Information changes saved.');
});