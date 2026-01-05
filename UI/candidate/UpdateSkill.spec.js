import { test, expect } from '@playwright/test';
import { loadCandidateCredentials } from '../../support/candidateCredentials.js';
import { Login } from '../../Pages/Login.js';
import { UpdateSkillsPage } from '../../Pages/UpdateSkils.js';


const candidate = loadCandidateCredentials()[0];


test('candidate can update skills section', async ({ page }) => {
  const loginPage = new Login(page);
  const updateSkills = new UpdateSkillsPage(page);

  await loginPage.goto();
  await loginPage.login(candidate.email, candidate.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/jobs');
  console.log('Candidate logged in successfully.');
  await updateSkills.handleMaybeLaterIfPresent();

  
  await updateSkills.clickProfile();
  await updateSkills.openProfile();
  await updateSkills.clickEditSkills();

  // Add multiple skills
  await updateSkills.updateSkills([
    'JavaScript',
    'Playwright',
    'Selenium',
    'Test Automation'
  ]);
});


