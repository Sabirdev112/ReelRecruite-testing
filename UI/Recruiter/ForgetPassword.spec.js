import { test } from '@playwright/test';
import { Login } from '../../Pages/Login.js';
import { ForgetPassword } from '../../Pages/ForgetPassword.js';
import { loadCredentials } from '../../support/recruiterCredentials.js';
import { changeRecruiterPassword, verifyPasswordUpdatedInDb } from '../../support/password.helper.js';

test('Recruiter forget password flow', async ({ page }) => {
  const recruiters = loadCredentials();
  const recruiter = recruiters[0];

  const otp = '123456';
  const oldPassword = recruiter.password;
  const newPassword = `${oldPassword}`; 

  // -------- Forget Password Flow --------
  const loginPage = new Login(page);
  await loginPage.goto();

  const forgetPasswordPage = new ForgetPassword(page);
  await forgetPasswordPage.clickForgetPassword();
  console.log('Forget password page opened successfully');
  await forgetPasswordPage.enterEmail(recruiter.email);
  console.log('Email entered successfully');
  await forgetPasswordPage.clickGetCode();
  await forgetPasswordPage.fillOTP(otp);
  console.log('OTP entered successfully');
  await forgetPasswordPage.clickContinue();
  console.log('OTP verification successful');
  await forgetPasswordPage.enterNewPassword(newPassword, newPassword);
  console.log('New password entered successfully');
  await forgetPasswordPage.clickSavePassword();

  console.log(`Password changed for ${recruiter.email} on UI`);

  // -------- DB Verification --------
  await verifyPasswordUpdatedInDb(recruiter.email, oldPassword, newPassword);

  // -------- Update credentials file --------
  await changeRecruiterPassword(recruiter.email, newPassword);
  console.log(`Password updated in Credentials.json for ${recruiter.email}`);
});
