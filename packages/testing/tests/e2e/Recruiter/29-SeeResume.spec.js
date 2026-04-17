import {test} from '../../fixtures/base.fixtures.js';
import { loadCredentials } from '../../utils/recruiterCredentials.js';
import { getLatestJobId } from '../../utils/job.helper.js';



const recruiter = loadCredentials()[0];
const jobUrl = getLatestJobId();


test('Recruiter see Resume', async ({ page, loginPage, seeResume }) => {
  
  

  await loginPage.goto();
  await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();

  await page.goto(jobUrl);

  await seeResume.navigateToApplications();
  await seeResume.viewCandidateDetails();
  await seeResume.viewCandidateProfile();
  await seeResume.navigateToResumeSection();
  await seeResume.clickViewResume();
});

