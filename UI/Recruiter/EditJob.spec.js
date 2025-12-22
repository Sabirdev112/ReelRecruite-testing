import {test} from '@playwright/test';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import { Login } from '../../Pages/Login.js';
import { EditJobPage } from '../../Pages/EditJob.js';

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

test('Recruiter Edits Job', async ({ page }) => {
  // ----------- Login -----------
  const loginPage = new Login(page);
  await loginPage.goto();
  await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/my-jobs');
  
  await page.goto(jobUrl);
  console.log(`Successfully navigated to Job URL: ${jobUrl}`);

  const editJob = new EditJobPage(page);
    await editJob.editJob();
    await editJob.updateDetails();
    await editJob.clickCustomFields();
    await editJob.saveChanges();
    console.log('Job edited successfully, Job ID:', jobId);
});