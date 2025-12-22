import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Login } from '../../Pages/Login.js';
import { UpdateAboutPage } from '../../Pages/UpdateAbout.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const recruiter = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../fixtures/Recruiter/Credentials.json'),
    'utf-8'
  )
)[0];

test('recruiter can update about section', async ({ page }) => {
  const loginPage = new Login(page);
  const updateAbout = new UpdateAboutPage(page);

  await loginPage.goto();
  await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/jobs');

  await updateAbout.handleMaybeLaterIfPresent();

  /* ---------- PROFILE ---------- */
  await updateAbout.clickProfile()
  await updateAbout.openProfile();
  await updateAbout.clickEditAbout();

  /* ---------- UPDATE ABOUT ---------- */
  await updateAbout.updateBio('Experienced software engineer with a passion for developing innovative programs that expedite the efficiency and effectiveness of organizational success.');
  await updateAbout.updateCountry('United States');
  await updateAbout.updateLocation('San Francisco, CA');
  await updateAbout.saveChanges();
  console.log('About section updated successfully.');
});
  // Optional: add an assertion if there is some confirmation text
  // await expect(page.getByText('Profile updated successfully')).toBeVisible();