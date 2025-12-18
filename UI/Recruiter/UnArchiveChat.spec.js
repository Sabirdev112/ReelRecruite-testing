import {test} from '@playwright/test';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import { Login } from '../../Pages/Login.js';
import { ArchiveChatPage} from '../../Pages/ArchiveChat.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load recruiter credentials
const recruiter = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../fixtures/Recruiter/Credentials.json'),
    'utf-8'
  )
)[0];

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
  await archiveChatPage.archiveChat();
  console.log('Chat Unarchived successfully');
});