import { test, expect } from '../../fixtures/base.fixtures.js';


import { verifyJobInDb } from '../../utils/jobDb.helper.js';
import { storeJobId } from '../../utils/job.helper.js';
import { loadCredentials } from '../../utils/recruiterCredentials.js';

const recruiter = loadCredentials()[0];

test('Recruiter login and create a new job', async ({ page, loginPage, createJobPage }) => {
  
  

  await loginPage.goto();
  await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/my-jobs');

  await createJobPage.openJobForm();
  await createJobPage.fillTitle('React Developer');
  await createJobPage.generateHighlight();
  await createJobPage.addRegionAndLocation('asia','pakistan');
  await createJobPage.fillJobTypeAndCompensation();
  await createJobPage.fillJobDescription();
  await createJobPage.clickNext();
  await createJobPage.addQuestions();
  await createJobPage.previewJob();
  
  // store JobId
  const jobId = await createJobPage.submitJob();
  expect(jobId).toBeTruthy();
  storeJobId(jobId);

  
  await createJobPage.seeAllApplications();
  await verifyJobInDb(jobId, recruiter.email);
});


