import { test } from '@playwright/test';
import { loadCredentials } from '../../support/recruiterCredentials.js';
import { getLatestJobId, buildJobUrl } from '../../support/job.helper.js';
import { Login } from '../../Pages/Login.js';
import { ShortlistCandidatePage } from '../../Pages/ShortListCandidate.js';

const recruiter = loadCredentials()[0];
const jobId = getLatestJobId();
const jobUrl = buildJobUrl(jobId);

test('Recruiter shortlists candidate from Applications', async ({ page }) => {
  // ----------- Login -----------
  const loginPage = new Login(page);
  await loginPage.goto();
  await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/my-jobs');

  // ----------- Navigate to job (FIXED) -----------
  await page.goto(jobUrl, { waitUntil: 'domcontentloaded' });

  console.log(`Successfully navigated to Job URL: ${jobUrl}`);

  // ----------- View reels & shortlist -----------
  const shortlistPage = new ShortlistCandidatePage(page);
  await shortlistPage.clickViewApplications();
  console.log('Viewed all application');
  await shortlistPage.clickViewDetails();
  console.log('Viewed candidate details');
  await shortlistPage.updateStatus();
  console.log('Updated status clicked');
  await shortlistPage.clickShortListed();
  console.log('Shortlisted candidate');
  await shortlistPage.clickSave();
});
