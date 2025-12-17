import { test, expect } from '@playwright/test';
import { Login } from '../../Pages/Login.js';
import { UpdateSkillsPage } from '../../Pages/UpdateSkils.js';

test('candidate can update skills section', async ({ page }) => {
  const loginPage = new Login(page);
  const updateSkills = new UpdateSkillsPage(page);

  await loginPage.goto();
  await loginPage.login('khurrramimran908@gmail.com', 'Tech@12345');
  await loginPage.clickSignIn();
  await page.waitForLoadState('networkidle');
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


