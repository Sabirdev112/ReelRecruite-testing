import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Login } from '../../Pages/Login.js';
import { ForgetPassword } from '../../Pages/ForgetPassword.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const forgetPasswordPath = path.join(__dirname, '../../fixtures/Recruiter/ForgetPassword.json');

test('Recruiter forget password flow', async ({ page }) => {
    
  // ----------- Read recruiter email and password from JSON -----------
  const recruiterRaw = fs.readFileSync(forgetPasswordPath, 'utf-8');
  if (!recruiterRaw) throw new Error('ForgetPassword.json is empty');

  const recruiters = JSON.parse(recruiterRaw);
  if (!Array.isArray(recruiters) || recruiters.length === 0) {
    throw new Error('No recruiters found in ForgetPassword.json');
  }

  const recruiter = recruiters[0];
  if (!recruiter.email || !recruiter.password) {
    throw new Error('Email or password missing in ForgetPassword.json');
  }

  const oldPassword = recruiter.password;
  const newPassword = `${oldPassword}_1`;
  const otp = '123456'; 

  // ----------- Navigate to login page -----------
  const loginPage = new Login(page);
  await loginPage.goto();

  // ----------- Forget Password flow -----------
  const forgetPasswordPage = new ForgetPassword(page);
  await forgetPasswordPage.clickForgetPassword();
  await forgetPasswordPage.enterEmail(recruiter.email);
  await forgetPasswordPage.clickGetCode();
  await forgetPasswordPage.fillOTP(otp);
  await forgetPasswordPage.clickContinue();
  await forgetPasswordPage.enterNewPassword(newPassword, newPassword);
  await forgetPasswordPage.clickSavePassword();

  console.log(`Password changed for ${recruiter.email} to ${newPassword}`);

  // ----------- Update forgetPassword.json with new password -----------
  const updatedRecruiters = recruiters.map(r =>
    r.email === recruiter.email ? { ...r, password: newPassword } : r
  );

  fs.writeFileSync(forgetPasswordPath, JSON.stringify(updatedRecruiters, null, 2), 'utf-8');

  console.log(`Password updated in ForgetPassword.json for ${recruiter.email}`);
});
