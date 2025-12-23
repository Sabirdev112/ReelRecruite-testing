import fs from 'fs';
import path from 'path';
import { test } from '@playwright/test';
import { SendMessagePage } from '../../Pages/SendMessagePage.js';
import { Login } from '../../Pages/Login.js';

const CREDENTIALS_FILE = path.join(
  process.cwd(),
  'fixtures/Recruiter/Credentials.json'
);

const RANDOM_MESSAGES_FILE = path.join(
  process.cwd(),
  'fixtures/Recruiter/randomMessages.json'
);

// 🔹 Get recruiter credentials
function getRecruiterCredentials() {
  const data = fs.readFileSync(CREDENTIALS_FILE, 'utf-8');
  const credentials = JSON.parse(data);
  return credentials[0]; // assuming first recruiter
}

// 🔹 Get random message
function getRandomMessage() {
  const data = fs.readFileSync(RANDOM_MESSAGES_FILE, 'utf-8');
  const messages = JSON.parse(data);

  if (!messages.length) {
    throw new Error('No messages found in randomMessages.json');
  }

  return messages[Math.floor(Math.random() * messages.length)];
}

test('recruiter logs in and sends a message', async ({ page }) => {
  const loginPage = new Login(page);
  const sendMessagePage = new SendMessagePage(page);

  // Step 1: Login using fixture credentials
  const recruiter = getRecruiterCredentials();

  await loginPage.goto();
  await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/my-jobs');

  // Step 2: Open messages
  await sendMessagePage.openMessages();
  console.log('Messages opened successfully');

  await sendMessagePage.selectMessage();
  console.log('Message selected successfully');

  // Step 3: Send random message
  const message = getRandomMessage();
  await sendMessagePage.sendMessage(message);

  console.log(`Message sent: ${message}`);
});
