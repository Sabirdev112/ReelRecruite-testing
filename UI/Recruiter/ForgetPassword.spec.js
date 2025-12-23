import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { Login } from '../../Pages/Login.js';
import { ForgetPassword } from '../../Pages/ForgetPassword.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------- Recruiter credentials (as requested) -----------
const recruiter = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../fixtures/Recruiter/Credentials.json'),
    'utf-8'
  )
)[0];

// ----------- Forget password data -----------
const forgetPasswordPath = path.join(
  __dirname,
  '../../fixtures/Recruiter/ForgetPassword.json'
);

const recruiters = JSON.parse(fs.readFileSync(forgetPasswordPath, 'utf-8'));
const forgetPasswordUser = recruiters[0];

test('Recruiter forget password flow', async ({ page }) => {
  const otp = '123456';
  const oldPassword = forgetPasswordUser.password;
  const newPassword = `${oldPassword}`;

  // ----------- Login page navigation -----------
  const loginPage = new Login(page);
  await loginPage.goto();

  // ----------- Forget Password flow -----------
  const forgetPasswordPage = new ForgetPassword(page);
  await forgetPasswordPage.clickForgetPassword();
  console.log('Forget password page opened successfully');
  await forgetPasswordPage.enterEmail(recruiter.email);
  console.log('Email entered successfully');
  await forgetPasswordPage.clickGetCode();
  console.log('Code sent successfully');
  await forgetPasswordPage.fillOTP(otp);
  console.log('OTP entered successfully');
  await forgetPasswordPage.clickContinue();
  console.log('OTP verified successfully');
  await forgetPasswordPage.enterNewPassword(newPassword, newPassword);
  console.log('New password entered successfully');
  await forgetPasswordPage.clickSavePassword();

  console.log(`Password changed for ${recruiter.email}`);

  // ----------- Overwrite password in ForgetPassword.json -----------
  const updatedRecruiters = recruiters.map(r => ({
    ...r,
    password: newPassword
  }));

  fs.writeFileSync(
    forgetPasswordPath,
    JSON.stringify(updatedRecruiters, null, 2),
    'utf-8'
  );

  console.log(`Password updated in ForgetPassword.json`, updatedRecruiters);
});
