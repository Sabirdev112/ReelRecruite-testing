import {test} from '@playwright/test';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {Login} from '../../Pages/Login.js';
import {SeeResumePage} from '../../Pages/SeeResume.js';

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

test('Recruiter see Resume', async ({ page }) => {
  const loginPage = new Login(page);
  const seeResume= new SeeResumePage(page);

  await loginPage.goto();
  await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();
  await page.waitForTimeout(5000); 

  await page.goto(jobUrl);
  console.log(`Successfully navigated to Job URL: ${jobUrl}`);

  await seeResume.navigateToApplications();
  console.log('Navigated to applications.');
  await seeResume.viewCandidateDetails();
  console.log('Viewed candidate details.');
  await seeResume.viewCandidateProfile();
  console.log('Viewed candidate profile.');
  await seeResume.navigateToResumeSection();
  console.log('Navigated to resume section.');
  await seeResume.clickViewResume();
  console.log('Resume view completed.');
});