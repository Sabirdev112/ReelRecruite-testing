import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../Pages/LoginPage.js';
import { UpdateEducationPage } from '../../../Pages/UpdateEducationPage.js';

test('Candidate logs in and adds education details', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  const addEducationPage = new UpdateEducationPage(page);

  // Step 1: Login as Candidate
  await loginPage.goto();
  await loginPage.login('muhammadsabir.dev@gmail.com', 'Sabir@123');


// Step 2: Add Education Details
  await addEducationPage.openProfile();
  await addEducationPage.addEducation();
  await addEducationPage.deleteEducationAt(); // Delete the 4th education entry (0-based index)
});