import { test, chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

import { LoginPage } from '../Pages/LoginPage.js';
import { ApplyJobPage } from '../Pages/ApplyJobPage.js';
import { SignupPage } from '../Pages/SignupPage.js';

const USERS_FILE = path.join(process.cwd(), 'users.json');

// Read all users
function getUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
}

// Store already used emails in memory
const usedEmails = new Set();

// Select a random user NOT used before
function getRandomUnusedUser(users) {
  const unused = users.filter(u => !usedEmails.has(u.email));

  if (unused.length === 0) return null; // all used

  const randomIndex = Math.floor(Math.random() * unused.length);
  const selected = unused[randomIndex];

  usedEmails.add(selected.email);
  return selected;
}

async function userFlow(browser, user, jobUrl) {
  const context = await browser.newContext({
    permissions: ['camera', 'microphone']
  });

  const page = await context.newPage();

  const signup = new SignupPage(page);
  const loginPage = new LoginPage(page);
  const applyJobPage = new ApplyJobPage(page);

  console.log(`Processing user: ${user.email}`);

  // SIGNUP
  await signup.goto();
  await signup.register();
  await signup.signup(user.fullName, user.email, user.password, user.password);
  await page.waitForTimeout(10000);

  // LOGIN
  await loginPage.goto();
  await loginPage.login(user.email, user.password);
  await loginPage.clickSignIn();
  await page.waitForTimeout(10000);
  // otp
  await loginPage.fillOTP('123456');
  await page.waitForTimeout(10000);

  // APPLY FOR JOB
  await page.goto(jobUrl);
  await applyJobPage.applyNow();
  await applyJobPage.recordVideo();
  await applyJobPage.submitApplication();
  await page.waitForTimeout(10000);

  // LOGOUT
  await loginPage.logout();
  await page.waitForTimeout(5000);

  await context.close();
}

test('Apply for specific job (random users, no duplicates)', async () => {
  const browser = await chromium.launch({ headless: false });
  const users = getUsers();
  const jobUrl = 'https://recruitai-web-production.up.railway.app/jobs/5ca0ffad-7d88-4743-9a56-bc42385dcad2';

  for (let i = 0; i < users.length; i++) {
    const user = getRandomUnusedUser(users);
    if (!user) {
      console.log("All users from JSON have been used.");
      break;
    }

    await userFlow(browser, user, jobUrl);
  }

  await browser.close();
});
