import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Login } from '../../Pages/Login.js';
import { UpdateAboutPage } from '../../Pages/UpdateAbout.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const candidate = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../fixtures/Candidate/Credentials.json'),
    'utf-8'
  )
)[0];

test('candidate can update about section', async ({ page }) => {
  const loginPage = new Login(page);
  const updateAbout = new UpdateAboutPage(page);

  await loginPage.goto();
  await loginPage.login(candidate.email, candidate.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/jobs');

  await updateAbout.handleMaybeLaterIfPresent();

  /* ---------- PROFILE ---------- */
  await updateAbout.clickProfile()
  await updateAbout.openProfile();
  await updateAbout.clickEditAbout();

  /* ---------- UPDATE ABOUT ---------- */
  await updateAbout.updateBio('Experienced software engineer with a passion for developing innovative programs that expedite the efficiency and effectiveness of organizational success.');
  console.log('Bio updated successfully.');
  await updateAbout.updateCountry('United States');
  console.log('Country updated successfully.');
  await updateAbout.updateLocation('San Francisco, CA');
  console.log('Location updated successfully.');
  await updateAbout.saveChanges();
  console.log('About section updated successfully.');
});
  // Optional: add an assertion if there is some confirmation text
  // await expect(page.getByText('Profile updated successfully')).toBeVisible();