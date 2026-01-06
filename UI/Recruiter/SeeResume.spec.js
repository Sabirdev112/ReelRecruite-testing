import {test} from '@playwright/test';
import { loadCredentials } from '../../support/recruiterCredentials.js';
import { getLatestJobId, buildJobUrl } from '../../support/job.helper.js';
import {Login} from '../../Pages/Login.js';
import {SeeResumePage} from '../../Pages/SeeResume.js';

const recruiter = loadCredentials()[0];
const jobId = getLatestJobId();
const jobUrl = buildJobUrl(jobId);

test('Recruiter see Resume', async ({ page }) => {
  const loginPage = new Login(page);
  const seeResume= new SeeResumePage(page);

  await loginPage.goto();
  await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();
  await page.waitForTimeout(5000); 

  await page.goto(jobUrl);
  console.log(`Successfully navigated to Job URL: ${jobUrl}`);

  await seeResume.navigateToApplications();
  console.log('Navigated to applications.');
  await seeResume.viewCandidateDetails();
  console.log('Viewed candidate details.');
  await seeResume.viewCandidateProfile();
  console.log('Viewed candidate profile.');
  await seeResume.navigateToResumeSection();
  console.log('Navigated to resume section.');
  await seeResume.clickViewResume();
  console.log('Resume view completed.');
});