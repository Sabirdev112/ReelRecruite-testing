import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Login } from '../../Pages/Login.js';
import { NotificationPage } from '../../Pages/Notification.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load recruiter credentials
const candidate = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../fixtures/Candidate/Credentials.json'),
    'utf-8'
  )
)[0];


test('Notification flow – handle empty & existing notifications', async ({
  page,
}) => {
  const login = new Login(page);
  const notification = new NotificationPage(page);

  await login.goto();
  await login.login(candidate.email, candidate.password);
  await login.clickSignIn();
  await page.waitForLoadState('networkidle');

  await notification.handleNotificationsFlow();

  console.log('Notification flow executed successfully');
});
