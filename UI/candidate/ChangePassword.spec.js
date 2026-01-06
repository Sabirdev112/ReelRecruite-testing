import { test } from '@playwright/test';
import { Login } from '../../Pages/Login.js';
import { ChangePassword } from '../../Pages/ChangePassword.js';
import {loadCredentials,updatePassword} from '../../support/candidateCredentials.js';

// ----------- Load candidate credentials -----------
const candidate = loadCredentials()[0];

test('Candidate changes password', async ({ page }) => {
  const oldPassword = candidate.password;
  const newPassword = `${oldPassword}`;

  // ----------- Login -----------
  const loginPage = new Login(page);
  const changePasswordPage = new ChangePassword(page);

  await loginPage.goto();
  await loginPage.login(candidate.email, oldPassword);
  await loginPage.clickSignIn();
  await page.waitForURL('**/jobs');

  await changePasswordPage.handleMaybeLaterIfPresent();

  // ----------- Change password -----------
  await changePasswordPage.openProfileMenu();
  await changePasswordPage.navigateToSettings();
  await changePasswordPage.changePassword(oldPassword, newPassword);
  await changePasswordPage.saveChanges();

  // ----------- Persist updated password -----------
  updatePassword(candidate.email, newPassword);

  console.log(`Password updated for ${candidate.email}`);
});
