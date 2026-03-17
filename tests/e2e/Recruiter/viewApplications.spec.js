import { test } from '../../fixtures/base.fixtures.js';
import { loadCredentials } from '../../utils/recruiterCredentials.js';
import { getLatestJobId, buildJobUrl } from '../../utils/job.helper.js';



const recruiter = loadCredentials()[0];
const jobId = getLatestJobId();
const jobUrl = buildJobUrl(jobId);

test('Recruiter view all applications for a job', async ({ page, loginPage, shortListCandidate }) => {
  
  await loginPage.goto();
  await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/my-jobs');

  await page.goto(jobUrl, { waitUntil: 'domcontentloaded' });
  
  await shortListCandidate.clickViewApplications();
});


