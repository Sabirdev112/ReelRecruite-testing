import {test, expect} from '@playwright/test';
import { Login } from '../../Pages/Login.js';
import { ArchiveChatPage} from '../../Pages/ArchiveChat.js';

test('Recruiter logs in and archives a chat', async ({ page }) => {
  const loginPage = new Login(page);
  const archiveChatPage = new ArchiveChatPage(page);

  // Step 1: Login
  await loginPage.goto();
  await loginPage.login('carlos@gmail.com', 'Carlos@123');
  await loginPage.clickSignIn();

  // Step 2: Archive a chat
  await archiveChatPage.openMessages();
  await archiveChatPage.openChat();
  await archiveChatPage.archiveChat();
});