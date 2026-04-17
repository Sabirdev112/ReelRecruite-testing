import { test } from '../../fixtures/base.fixtures.js';
import { loadCredentials } from '../../utils/recruiterCredentials.js';
import { getLatestJobId } from '../../utils/job.helper.js';



const recruiter = loadCredentials()[0];
const jobUrl = getLatestJobId();


test('Recruiter shortlists candidate from Applications', async ({ page, loginPage, shortListCandidate }) => {
  
  await loginPage.goto();
  await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/my-jobs');


  await page.goto(jobUrl);

  
  await shortListCandidate.clickViewApplications();
  await shortListCandidate.clickViewDetails();
  await shortListCandidate.updateStatus();
  await shortListCandidate.clickShortListed();
  await shortListCandidate.clickSave();
});


