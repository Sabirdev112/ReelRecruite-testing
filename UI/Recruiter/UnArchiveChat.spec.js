import {test} from '@playwright/test';
import { loadCredentials } from '../../support/recruiterCredentials.js';
import { Login } from '../../Pages/Login.js';
import { ArchiveChatPage} from '../../Pages/ArchiveChat.js';

const recruiter = loadCredentials()[0];

test('Recruiter logs in and Unarchives a chat', async ({ page }) => {
  const loginPage = new Login(page);
  const archiveChatPage = new ArchiveChatPage(page);

  // Step 1: Login
  await loginPage.goto();
    await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();

  // Step 2: Archive a chat
  await archiveChatPage.openMessages();
  await archiveChatPage.openChat();
  await archiveChatPage.unArchiveChat();
  console.log('Chat Unarchived successfully');
});