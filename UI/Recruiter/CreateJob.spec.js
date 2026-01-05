import { test, expect } from '@playwright/test';
import { Login } from '../../Pages/Login.js';
import { CreateJobPage } from '../../Pages/CreateJobPage.js';
import { verifyJobInDb } from '../../support/jobDb.helper.js';
import { storeJobId } from '../../support/job.helper.js';
import { loadCredentials } from '../../support/recruiterCredentials.js';

const recruiter = loadCredentials()[0];

test('Recruiter login and create a new job', async ({ page }) => {
  const loginPage = new Login(page);
  const createJob = new CreateJobPage(page);

  // -------- Login --------
  await loginPage.goto();
  await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/my-jobs');
  console.log('Recruiter logged in successfully');

  // -------- Job creation flow --------
  await createJob.openJobForm();
  console.log('Job form opened successfully');
  await createJob.fillJobDetails();
  console.log('Job details filled successfully');
  await createJob.fillJobTypeAndCompensation();
  console.log('Job type and compensation filled successfully');
  await createJob.fillJobDescription();
  console.log('Job description filled successfully');
  await createJob.addSkills();
  console.log('Skills added successfully');
  await createJob.fillRequirements();
  console.log('Requirements filled successfully');
  await createJob.addQuestions();
  console.log('Questions added successfully');
  await createJob.previewJob();

  // -------- Submit job and store jobId --------
  const jobId = await createJob.submitJob();
  expect(jobId).toBeTruthy();
  console.log(`Job successfully created with ID: ${jobId}`);
  storeJobId(jobId);

  
  await createJob.seeAllApplications();
  await verifyJobInDb(jobId, recruiter.email);
});
