import {test} from '../../fixtures/base.fixtures.js';
import {loadCredentials} from '../../utils/recruiterCredentials.js';




const recruiter = loadCredentials()[0];



test ('Recruiter saves a job draft', async ({page, loginPage, saveDraft}) => {

  await loginPage.goto();
  await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/my-jobs');
  await saveDraft.clickIfVisible();
  
  await saveDraft.postJob();
  await saveDraft.fillBasicInfo();
  await saveDraft.saveDraft();
  
});

