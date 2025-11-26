import { test, chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { LoginPage } from '../Pages/LoginPage.js';
import { ApplyJobPage } from '../Pages/ApplyJobPage.js';

const USERS_FILE = path.join(process.cwd(), 'users.json');
const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));

/**
 * Handles login → OTP → apply job → logout for one user
 */
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
  await loginPage.login(user.email, user.password);

  // Click sign in button if separate
  if (loginPage.clickSignIn) {
    await loginPage.clickSignIn();
  }

  await loginPage.fillOTP('123456');

  // --- APPLY FOR JOB ---
  await page.goto(jobUrl);

  await applyJobPage.applyNow();
  await applyJobPage.recordVideo();
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
  const jobUrl = 'https://recruitai-web-production.up.railway.app/jobs/5ca0ffad-7d88-4743-9a56-bc42385dcad2';

  for (const user of users) {
    try {
      await userFlow(browser, user, jobUrl);
    } catch (error) {
      console.log(`Failed to process user: ${user.email}`, error);
      continue; // continue with next user
    }
  }

  await browser.close();
});
