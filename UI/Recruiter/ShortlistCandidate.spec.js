import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Login } from '../../Pages/Login.js';
import { ShortlistCandidatePage } from '../../Pages/ShortListCandidate.js';

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

test('Recruiter shortlists candidate from Applications', async ({ page }) => {
  // ----------- Login -----------
  const loginPage = new Login(page);
  await loginPage.goto();
  await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/my-jobs');

  // ----------- Navigate to job (FIXED) -----------
  await page.goto(jobUrl, { waitUntil: 'domcontentloaded' });

  console.log(`Successfully navigated to Job URL: ${jobUrl}`);

  // ----------- View reels & shortlist -----------
  const shortlistPage = new ShortlistCandidatePage(page);
  await shortlistPage.clickViewApplications();
  console.log('Viewed all application');
  await shortlistPage.clickViewDetails();
  console.log('Viewed candidate details');
  await shortlistPage.updateStatus();
  console.log('Updated status clicked');
  await shortlistPage.clickShortListed();
  console.log('Shortlisted candidate');
  await shortlistPage.clickSave();
});
