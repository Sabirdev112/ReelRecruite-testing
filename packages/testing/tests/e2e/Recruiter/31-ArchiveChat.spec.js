import {test} from '../../fixtures/base.fixtures.js';
import { loadCredentials } from '../../utils/recruiterCredentials.js';
import { getLatestJobUrl } from '../../utils/job.helper.js';

const jobUrl = getLatestJobUrl();
const recruiter = loadCredentials()[0];

test('Recruiter logs in and archives/unarchives a chat', async ({ page, loginPage, archiveChat }) => {

  await loginPage.goto();
  await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/my-jobs');
  await page.goto(jobUrl);
  await archiveChat.clickViewApplications();
  await archiveChat.clickViewDetails();
  await archiveChat.clickMessagesButton();
  await archiveChat.archiveChat();
  await archiveChat.unArchiveChat();
});

