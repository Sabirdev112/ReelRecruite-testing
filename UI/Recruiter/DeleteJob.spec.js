import { test, } from '@playwright/test';
import { Login } from '../../Pages/Login.js';
import { deleteJobPage } from '../../Pages/DeleteJob.js';
import { verifyJobDeleted } from '../../support/jobDb.helper.js';
import { loadCredentials } from '../../support/recruiterCredentials.js';
import { getLatestJobId, buildJobUrl } from '../../support/job.helper.js';

const recruiter = loadCredentials()[0];
const jobId = getLatestJobId();
const jobUrl = buildJobUrl(jobId);


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

   // ----------- DB verification using helper -----------
  await verifyJobDeleted(jobId);

});
