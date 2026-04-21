import { test } from '../../fixtures/base.fixtures.js';
import { loadCredentials } from '../../utils/recruiterCredentials.js';
import { getLatestJobId } from '../../utils/job.helper.js';

const recruiter = loadCredentials()[0];
const jobUrl = getLatestJobId();

test('Recruiter can view reels and scroll', async ({ page, loginPage, viewReels }) => {
    
  await loginPage.goto();
  await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/my-jobs');
  await page.goto(jobUrl, { waitUntil: 'domcontentloaded' });
  await viewReels.navigateToViewReels();
  await viewReels.scrollToReel(viewReels.scrollLocator);

});


