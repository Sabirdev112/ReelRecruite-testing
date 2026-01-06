import {test} from '@playwright/test';
import { loadCredentials } from '../../support/recruiterCredentials.js';
import { getLatestJobId, buildJobUrl } from '../../support/job.helper.js';
import { Login } from '../../Pages/Login.js';
import { EditJobPage } from '../../Pages/EditJob.js';

const recruiter = loadCredentials()[0];
const jobId = getLatestJobId();
const jobUrl = buildJobUrl(jobId);


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
    console.log('Job details updated successfully');
    await editJob.clickCustomFields();
    await editJob.saveChanges();
    console.log('Job edited successfully, Job ID:', jobId);
});