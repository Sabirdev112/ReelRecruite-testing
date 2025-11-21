import {test} from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage.js';
import { CandidateAboutPage } from '../Pages/CandidateAboutPage.js';
test('Candidate logs in and updates About section', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const candidateAboutPage = new CandidateAboutPage(page);

  // Step 1: Login as Candidate
  await loginPage.goto();
  await loginPage.login('muhammadsabir.dev@gmail.com', 'Sabir@123');
  

  // Step 2: Open the About editor section
  await candidateAboutPage.openProfile();
  await candidateAboutPage.openAboutEditor();
  await candidateAboutPage.updateAbout();
  await candidateAboutPage.saveChanges();
});