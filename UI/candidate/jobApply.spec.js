import { test, chromium, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Login } from '../../Pages/Login.js';
import { ApplyJobPage } from '../../Pages/ApplyJobPage.js';
import { runQuery } from '../../utils/db/dbClient.js'; // Add your DB client

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
  await page.waitForURL('**/jobs');
  console.log('Candidate logged in successfully.');
  await applyJobPage.handleMaybeLaterIfPresent();

  // APPLY JOB
  await page.goto(jobUrl);
  await applyJobPage.applyNow();
  await applyJobPage.recordVideo();
  await page.waitForTimeout(10000);
  await applyJobPage.stopRecording();
  await applyJobPage.answerOne();
  console.log(`Answered question 1 for: ${user.email}`);
  await applyJobPage.answerTwo();
  console.log(`Answered question 2 for: ${user.email}`);
  await applyJobPage.submitApplication();
  console.log(`Application submitted for: ${user.email}`);

  // Get candidate ID from email
const candidateRecords = await runQuery(
  `SELECT id FROM users WHERE email = $1`,
  [user.email]
);

expect(candidateRecords.length).toBe(1);
const candidateId = candidateRecords[0].id;

// Verify application exists
const applicationsInDb = await runQuery(
  `
  SELECT id, candidate_id, job_id
  FROM applications
  WHERE candidate_id = $1 AND job_id = $2
  `,
  [candidateId, jobId]
);

expect(applicationsInDb.length).toBe(1);
console.log(`DB verification passed: Application exists for ${user.email}`);

// Optional: Verify answers were recorded
const applicationId = applicationsInDb[0].id;
const answersInDb = await runQuery(
  `
  SELECT id, application_id, job_question_id, answer
  FROM application_answers
  WHERE application_id = $1
  `,
  [applicationId]
);

expect(answersInDb.length).toBeGreaterThan(0);
console.log(`DB verification passed: Answers recorded for application ${applicationId}`);
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

  
});
