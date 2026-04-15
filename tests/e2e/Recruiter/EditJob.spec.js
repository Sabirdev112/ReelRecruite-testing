import {test} from '../../fixtures/base.fixtures.js';
import { loadCredentials } from '../../utils/recruiterCredentials.js';
import { getLatestJobId } from '../../utils/job.helper.js';

const recruiter = loadCredentials()[0];
const jobUrl = getLatestJobId();


test('Recruiter Edits Job', async ({ page, loginPage, editJob }) => {
  
    await loginPage.goto();
    await loginPage.login(recruiter.email, recruiter.password);
    await loginPage.clickSignIn();
    await page.waitForURL('**/my-jobs');
  
    await page.goto(jobUrl);

    
    await editJob.editJob();
    await editJob.updateDetails();
    await editJob.clickCustomFields();
    await editJob.saveChanges();
});

