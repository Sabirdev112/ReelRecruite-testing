import { test, expect } from '@playwright/test';
import { Login } from '../../Pages/Login.js';
import { CreateJobPage } from '../../Pages/CreateJobPage.js';
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

  // Job creation flow
  await createJob.openJobForm();
  await createJob.fillJobDetails();
  await createJob.fillJobTypeAndCompensation();
  await createJob.fillJobDescription();
  await createJob.addSkills();
  await createJob.fillRequirements();
  await createJob.addQuestions();
  await createJob.previewJob();

  // Submit job and capture jobId from POM
  const jobId = await createJob.submitJob();
expect(jobId).toBeTruthy();

  console.log(`Job successfully created with ID: ${jobId}`);

  // Navigate to applications
  await createJob.seeAllApplications();
});
