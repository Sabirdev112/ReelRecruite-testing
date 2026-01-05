import {test} from '@playwright/test';
import {loadCredentials} from '../../support/candidateCredentials.js';
import {Login} from '../../Pages/Login.js';
import {UpdateInfoPage} from '../../Pages/UpdateInfo.js';

const candidate = loadCredentials()[0];



test('Candidate info, profile picture, and banner update', async ({ page }) => {
  // -------- Login --------
  const loginPage = new Login(page);
   const updateInfoPage = new UpdateInfoPage(page);
  await loginPage.goto();
  await loginPage.login(candidate.email, candidate.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/jobs');
  console.log('Candidate logged in successfully.');

 

  await updateInfoPage.handleMaybeLaterIfPresent();
  await updateInfoPage.openProfileMenu();
  await updateInfoPage.clickProfile();
  await updateInfoPage.clickEditProfile();
  await updateInfoPage.uploadCoverImage();
  console.log('Cover image updated.');
  await updateInfoPage.uploadProfilePicture();
  console.log('Profile picture updated.');
  await updateInfoPage.fillFullName('Sabir SQA');
  console.log('Full name updated.');
  await updateInfoPage.fillProfessionalTitle('Senior QA Engineer');
  console.log('Professional title updated.');
  await updateInfoPage.clickSaveChanges();
  console.log('Information changes saved.');
});