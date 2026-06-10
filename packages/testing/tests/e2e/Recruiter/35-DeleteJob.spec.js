import { test, } from '../../fixtures/base.fixtures.js';
import { verifyJobDeleted } from '../../utils/jobDb.helper.js';
import { loadCredentials } from '../../utils/recruiterCredentials.js';
import { getLatestJobUrl, getLatestJobId } from '../../utils/job.helper.js';

const recruiter = loadCredentials()[0];
const jobUrl = getLatestJobUrl();
const jobId = getLatestJobId();

test('Recruiter delete job', async ({ page, loginPage, deleteJob }) => {
 
  await loginPage.goto();
  await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/my-jobs');
  await page.goto(jobUrl);
  await deleteJob.deleteJob();
  await deleteJob.confirmDelete();

  await verifyJobDeleted(jobId);

});


