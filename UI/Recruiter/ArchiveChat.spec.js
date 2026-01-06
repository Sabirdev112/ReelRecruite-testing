import {test} from '@playwright/test';
import { Login } from '../../Pages/Login.js';
import { ArchiveChatPage} from '../../Pages/ArchiveChat.js';
import { loadCredentials } from '../../support/recruiterCredentials.js';

const recruiter = loadCredentials()[0];

test('Recruiter logs in and archives a chat', async ({ page }) => {
  const loginPage = new Login(page);
  const archiveChatPage = new ArchiveChatPage(page);

  // Step 1: Login
  await loginPage.goto();
    await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();

  // Step 2: Archive a chat
  await archiveChatPage.openMessages();
  console.log('Messages opened successfully');
  await archiveChatPage.openChat();
  console.log('Chat opened successfully');
  await archiveChatPage.archiveChat();
  console.log('Chat archived successfully');
});