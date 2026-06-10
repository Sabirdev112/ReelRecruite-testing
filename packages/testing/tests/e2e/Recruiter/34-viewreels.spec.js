import { test } from '../../fixtures/base.fixtures.js';
import { loadCredentials } from '../../utils/recruiterCredentials.js';
import { getLatestJobUrl } from '../../utils/job.helper.js';

const recruiter = loadCredentials()[0];
const jobUrl = getLatestJobUrl();

test('Recruiter can view reels and scroll', async ({ page, loginPage, viewReels }) => {

  await loginPage.goto();
  await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/my-jobs');
  await page.goto(jobUrl);
  await viewReels.navigateToViewReels();
});


