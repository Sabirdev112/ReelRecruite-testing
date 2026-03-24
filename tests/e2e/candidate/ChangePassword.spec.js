import { test } from '../../fixtures/base.fixtures.js';


import {loadCredentials,updatePassword} from '../../utils/candidateCredentials.js';

const candidate = loadCredentials()[0];

test('Candidate changes password', async ({ page, loginPage, changePassword }) => {
  const oldPassword = candidate.password;
  const newPassword = `${oldPassword}`;

  
  

  await loginPage.goto();
  await loginPage.login(candidate.email, oldPassword);
  await loginPage.clickSignIn();
  await page.waitForURL('**/jobs');

  await changePassword.openProfileMenu();
  await changePassword.navigateToSettings();
  await changePassword.changePassword(oldPassword, newPassword);
  await changePassword.saveChanges();

  updatePassword(candidate.email, newPassword);

  
});


