import { test, chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Login } from '../../Pages/Login.js';
import { ApplyJobPage } from '../../Pages/ApplyJobPage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load candidate credentials
const users = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../fixtures/Candidate/Credentials.json'),
    'utf-8'
  )
);

// Load latest job ID from fixture
const jobDataPath = path.join(__dirname, '../../fixtures/recruiter/jobid.json');
if (!fs.existsSync(jobDataPath)) {
  throw new Error('Job ID file not found. Create a job first!');
}
const jobData = JSON.parse(fs.readFileSync(jobDataPath, 'utf-8'));
const jobId = jobData.jobId;

// Construct the job URL dynamically
const jobUrl = `https://recruitai-web-production.up.railway.app/jobs/${jobId}`;

async function userFlow(browser, user, jobUrl) {
  const context = await browser.newContext({
    permissions: ['camera', 'microphone']
  });

  const page = await context.newPage();

  const loginPage = new Login(page);
  const applyJobPage = new ApplyJobPage(page);

  console.log(`Processing user: ${user.email}`);

  // LOGIN
  await loginPage.goto();
  await loginPage.login(user.email, user.password);
  await loginPage.clickSignIn();

  // Wait for dashboard signal (avoid networkidle)
  await page.waitForURL('**/jobs');

  // APPLY JOB
  await page.goto(jobUrl);
  await applyJobPage.applyNow();
  await applyJobPage.recordVideo();
  await page.waitForTimeout(10000);
  await applyJobPage.stopRecording();
  await applyJobPage.answerOne();
  await applyJobPage.answerTwo();
  await applyJobPage.submitApplication();
  console.log(`Application submitted for: ${user.email}`);
}

test('Apply for latest job (users from JSON)', async () => {
  const browser = await chromium.launch({ headless: false });

  for (const user of users) {
    try {
      await userFlow(browser, user, jobUrl);
    } catch (err) {
      console.error(`Failed for ${user.email}`, err);
    }
  }

  await browser.close();
});
