import { test } from '@playwright/test';
import { loadCredentials } from '../../support/recruiterCredentials.js';
import { getLatestJobId, buildJobUrl } from '../../support/job.helper.js';
import { Login } from '../../Pages/Login.js';
import { ShortlistCandidatePage } from '../../Pages/ShortListCandidate.js';

const recruiter = loadCredentials()[0];
const jobId = getLatestJobId();
const jobUrl = buildJobUrl(jobId);

test('Recruiter view all applications for a job', async ({ page }) => {
  // ----------- Login -----------
  const loginPage = new Login(page);
  await loginPage.goto();
  await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/my-jobs');

  await page.goto(jobUrl, { waitUntil: 'domcontentloaded' });
  console.log(`Successfully navigated to Job URL: ${jobUrl}`);

  // ----------- View reels & shortlist -----------
  const shortlistPage = new ShortlistCandidatePage(page);
  await shortlistPage.clickViewApplications();
  console.log('Viewed all applications successfully');
});
