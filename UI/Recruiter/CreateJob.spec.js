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
  console.log('Job form opened successfully');
  await createJob.fillJobDetails();
  console.log('Job details filled successfully');
  await createJob.fillJobTypeAndCompensation();
  console.log('Job type and compensation filled successfully');
  await createJob.fillJobDescription();
  console.log('Job description filled successfully');
  await createJob.addSkills();
  console.log('Job skills added successfully');
  await createJob.fillRequirements();
  console.log('Job requirements filled successfully');
  await createJob.addQuestions();
  console.log('Job questions added successfully');
  await createJob.previewJob();
  console.log('Job previewed successfully');

  // Submit job and capture jobId from POM
  const jobId = await createJob.submitJob();
expect(jobId).toBeTruthy();

  console.log(`Job successfully created with ID: ${jobId}`);

  // Navigate to applications
  await createJob.seeAllApplications();
});
