import { test, expect } from '@playwright/test';
import { Login } from '../../Pages/Login.js';
import { CreateJobPage } from '../../Pages/CreateJobPage.js';
import { runQuery } from '../../utils/db/dbClient.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load recruiter credentials
const recruiter = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../fixtures/Recruiter/Credentials.json'),
    'utf-8'
  )
)[0];

test('Recruiter login and create a new job', async ({ page }) => {
  const loginPage = new Login(page);
  const createJob = new CreateJobPage(page);

  // Login
  await loginPage.goto();
  await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/my-jobs');
  console.log('Recruiter logged in successfully');

  // Job creation flow
  await createJob.openJobForm();
  await createJob.fillJobDetails();
  await createJob.fillJobTypeAndCompensation();
  await createJob.fillJobDescription();
  await createJob.addSkills();
  await createJob.fillRequirements();
  await createJob.addQuestions();
  await createJob.previewJob();

  // Submit job and capture jobId
  const jobId = await createJob.submitJob();
  expect(jobId).toBeTruthy();

  console.log(`Job successfully created with ID: ${jobId}`);

  /* =========================
     DB VERIFICATION (READ ONLY)
     ========================= */

  const jobs = await runQuery(
    `
    SELECT j.id, j.title, j.recruiter_id, u.email
    FROM jobs j
    JOIN users u ON u.id = j.recruiter_id
    WHERE j.id = $1
    `,
    [jobId]
  );

  expect(jobs.length).toBe(1);
  expect(jobs[0].id).toBe(jobId);
  expect(jobs[0].email).toBe(recruiter.email);

  console.log('DB verification passed: Job exists and recruiter is correct');

  // Navigate to applications
  await createJob.seeAllApplications();
});
