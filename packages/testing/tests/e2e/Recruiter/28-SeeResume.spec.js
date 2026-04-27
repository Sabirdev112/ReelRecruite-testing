import {test} from '../../fixtures/base.fixtures.js';
import { loadCredentials } from '../../utils/recruiterCredentials.js';
import { getLatestJobUrl } from '../../utils/job.helper.js';

test('Recruiter see Resume', async ({ page, loginPage, seeResume }) => {
  const recruiter = loadCredentials()[0];
  const jobUrl = getLatestJobUrl();

  await loginPage.goto();
  await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/my-jobs');
  await page.goto(jobUrl);
  await seeResume.navigateToApplications();
  await seeResume.viewCandidateDetails();
  await seeResume.viewCandidateProfile();
  await seeResume.navigateToResumeSection();
  await seeResume.clickViewResume();
});

