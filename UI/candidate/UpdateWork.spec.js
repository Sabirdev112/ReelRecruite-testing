import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Login } from '../../Pages/Login.js';
import { UpdateWorkPage } from '../../Pages/UpdateWork.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const candidate = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../fixtures/Candidate/Credentials.json'),
    'utf-8'
  )
)[0];

test('Candidate deletes existing work (if any) and adds new experience', async ({ page }) => {
  const loginPage = new Login(page);
  const updateWorkPage = new UpdateWorkPage(page);

  /* ---------- LOGIN ---------- */
  await loginPage.goto();
  await loginPage.login(candidate.email, candidate.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/jobs');
  await updateWorkPage.handleMaybeLaterIfPresent();


  /* ---------- PROFILE ---------- */
  await updateWorkPage.openProfileDropdown();
  await updateWorkPage.openProfile();
  await updateWorkPage.navigateToWorkSection();

  /* ---------- DELETE IF EXISTS ---------- */
  await updateWorkPage.deleteIfVisibleAndProceed();
  console.log('Existing work experience deleted if it existed.');

  /* ---------- ADD EXPERIENCE ---------- */
  await updateWorkPage.clickAddWork();
  console.log('Adding new work experience...');
  await updateWorkPage.addCompany('Tech Solutions Inc');
  await updateWorkPage.addPosition('Senior Software Engineer');
  await updateWorkPage.addEmploymentType('Full-time');
  await updateWorkPage.addLocationType('On-site');
  await updateWorkPage.addStartDate('2021-01-01');
  await updateWorkPage.addEndDate();
  await updateWorkPage.addDescription(
    'Led QA automation initiatives and improved delivery quality'
  );

  await updateWorkPage.addAchievement('Reduced regression failures by 40%');
  await updateWorkPage.addAchievement('Introduced Playwright automation');

  await updateWorkPage.addSkill('Playwright');
  await updateWorkPage.addSkill('JavaScript');

  await updateWorkPage.saveChanges();
  console.log('New work experience added and changes saved.');

  /* ---------- ASSERT ---------- */
  await expect(page.getByText('Tech Solutions Inc')).toBeVisible();
});
