import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Login } from '../../Pages/Login.js';
import { ChangePassword } from '../../Pages/ChangePassword.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------- Load candidate credentials -----------
const user = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../fixtures/Candidate/Credentials.json'),
    'utf-8'
  )
)[0];

test('Candidate changes password', async ({ page }) => {
  const oldPassword = user.password;
  const newPassword = `${oldPassword}`;

  // ----------- Login -----------
  const loginPage = new Login(page);
  const changePasswordPage = new ChangePassword(page);

  await loginPage.goto();
  await loginPage.login(user.email, oldPassword);
  await loginPage.clickSignIn();
  await page.waitForURL('**/jobs');
  await changePasswordPage.handleMaybeLaterIfPresent();
  

  // ----------- Change password -----------
  
  await changePasswordPage.openProfileMenu();
  await changePasswordPage.navigateToSettings();
  await changePasswordPage.changePassword(oldPassword, newPassword);
  await changePasswordPage.saveChanges();

  console.log('New password:', newPassword);

  // ----------- Update credentials.json -----------
  const credentialsPath = path.join(
    __dirname,
    '../../fixtures/candidate/credentials.json'
  );

  const users = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));

  const updatedUsers = users.map(u =>
    u.email === user.email ? { ...u, password: newPassword } : u
  );

  fs.writeFileSync(
    credentialsPath,
    JSON.stringify(updatedUsers, null, 2),
    'utf-8'
  );
});
