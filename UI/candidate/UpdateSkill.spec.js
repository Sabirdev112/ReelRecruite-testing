import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Login } from '../../Pages/Login.js';
import { UpdateSkillsPage } from '../../Pages/UpdateSkils.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load candidate credentials
const candidate = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../fixtures/Candidate/Credentials.json'),
    'utf-8'
  )
)[0];


test('candidate can update skills section', async ({ page }) => {
  const loginPage = new Login(page);
  const updateSkills = new UpdateSkillsPage(page);

  await loginPage.goto();
  await loginPage.login(candidate.email, candidate.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/jobs');
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


