import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { Login } from '../../Pages/Login.js';
import { ChangePassword } from '../../Pages/ChangePassword.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const credentialsPath = path.join(__dirname, '../../fixtures/candidate/credentials.json');

test('Candidate changes password ', async ({ page }) => {
  // ----------- Read candidate safely -----------
  const candidatesRaw = fs.readFileSync(credentialsPath, 'utf-8');
  if (!candidatesRaw) throw new Error('Credentials file is empty');

  const candidates = JSON.parse(candidatesRaw);
  if (!Array.isArray(candidates) || candidates.length === 0) {
    throw new Error('No candidates found in credentials.json');
  }

  const candidate = candidates[0];
  if (!candidate.email || !candidate.password) {
    throw new Error('Email or password is missing in credentials.json');
  }

  const oldPassword = candidate.password;
  const newPassword = `${oldPassword}_1`; // slight change

  // ----------- Login with old password -----------
  const loginPage = new Login(page);
  await loginPage.goto();
  await loginPage.login(candidate.email, oldPassword);
  await loginPage.clickSignIn();
  await page.waitForURL('**/jobs');

  // ----------- Change password -----------
  const changePasswordPage = new ChangePassword(page);
  await changePasswordPage.openProfileMenu();
  await changePasswordPage.navigateToSettings();
  await changePasswordPage.changePassword(oldPassword, newPassword);
  await changePasswordPage.saveChanges();

  console.log('New password:', newPassword);

  // ----------- Update credentials.json -----------
  const updatedCandidates = candidates.map(c =>
    c.email === candidate.email ? { ...c, password: newPassword } : c
  );

  fs.writeFileSync(credentialsPath, JSON.stringify(updatedCandidates, null, 2), 'utf-8');

});
