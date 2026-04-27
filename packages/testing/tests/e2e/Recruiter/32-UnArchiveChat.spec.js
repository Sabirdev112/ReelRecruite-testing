import {test} from '../../fixtures/base.fixtures.js';
import { loadCredentials } from '../../utils/recruiterCredentials.js';

const recruiter = loadCredentials()[0];

test('Recruiter logs in and Unarchives a chat', async ({ page, loginPage, archiveChat }) => {

  await loginPage.goto();
  await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/my-jobs');
  await archiveChat.openMessages();
  await archiveChat.openChat();
  await archiveChat.unArchiveChat();
});

