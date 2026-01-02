import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Login } from '../../Pages/Login.js';
import { deleteJobPage } from '../../Pages/DeleteJob.js';
import { runQuery } from '../../utils/db/dbClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load recruiter credentials
const recruiter = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../fixtures/Recruiter/Credentials.json'),
    'utf-8'
  )
)[0];

// Load job ID
const { jobId } = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../fixtures/Recruiter/jobid.json'),
    'utf-8'
  )
);

// Construct job URL
const jobUrl = `https://recruitai-web-production.up.railway.app/jobs/${jobId}`;

test('Recruiter delete job', async ({ page }) => {
  // ----------- Login -----------
  const loginPage = new Login(page);
  await loginPage.goto();
  await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/my-jobs');
  console.log('Recruiter logged in successfully');
  
  await page.goto(jobUrl);
  console.log(`Successfully navigated to Job URL: ${jobUrl}`);

  // ----------- Delete Job -----------
  const deleteJob = new deleteJobPage(page);
  await deleteJob.deleteJob();
  await deleteJob.confirmDelete();
  console.log('Job deleted successfully, Job ID:', jobId);

  /* =========================
     DB VERIFICATION (READ ONLY)
     ========================= */

const jobs = await runQuery(
  `
  SELECT id, "is_deleted"
  FROM jobs
  WHERE id = $1
  `,
  [jobId]
);

// Verify that exactly one job is returned
expect(jobs.length).toBe(1);

// Verify that the job is soft-deleted
expect(jobs[0].is_deleted).toBe(true);

console.log('DB verification passed: Job is soft-deleted');


});
