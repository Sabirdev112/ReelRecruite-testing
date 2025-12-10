import { test, chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { LoginPage } from '../../Pages/LoginPage.js';
import { ApplyJobPage } from '../../Pages/ApplyJobPage.js';

const USERS_FILE = path.join(process.cwd(), 'users.json');
const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));

async function userFlow(browser, user, jobUrl) {
  const context = await browser.newContext({
    permissions: ['camera', 'microphone']
  });

  const page = await context.newPage();

  const loginPage = new LoginPage(page);
  const applyJobPage = new ApplyJobPage(page);

  console.log(`Processing user: ${user.email}`);

  // --- LOGIN ---
  await loginPage.goto();

  // ✅ PASS EMAIL & PASSWORD PROPERLY
  await loginPage.login("khurrramimran908@gmail", "Tech@123456");
  await loginPage.clickSignIn("khurrramimran908@gmail", "Tech@123456");

  await page.waitForTimeout(5000);

  // --- APPLY FOR JOB ---
  await page.goto(jobUrl);

  await applyJobPage.applyNow();
  await applyJobPage.recordVideo();
  await page.waitForTimeout(10000);
  await applyJobPage.stopRecording();
  await page.waitForTimeout(3000);
  await applyJobPage.submitApplication();

  // --- LOGOUT ---
  if (loginPage.logout) {
    await loginPage.logout();
    await page.waitForSelector('text=Sign In', { timeout: 10000 });
  }

  await context.close();
}

test('Apply for specific job (all users from JSON)', async () => {
  const browser = await chromium.launch({ headless: false });

  const jobUrl =
    'https://recruitai-web-production.up.railway.app/jobs/0ecbefe5-c622-4d1e-baee-83145a4b3f09';

  for (const user of users) {
    try {
      await userFlow(browser, user, jobUrl);
    } catch (error) {
      console.log(`Failed to process user: ${user.email}`, error);
      continue;
    }
  }

  await browser.close();
});
