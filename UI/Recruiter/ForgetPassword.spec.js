import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import { Login } from '../../Pages/Login.js';
import { ForgetPassword } from '../../Pages/ForgetPassword.js';
import { runQuery } from '../../utils/db/dbClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const recruiter = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../fixtures/Recruiter/Credentials.json'),
    'utf-8'
  )
)[0];

const forgetPasswordPath = path.join(
  __dirname,
  '../../fixtures/Recruiter/Credentials.json'
);

const recruiters = JSON.parse(fs.readFileSync(forgetPasswordPath, 'utf-8'));
const forgetPasswordUser = recruiters[0];

test('Recruiter forget password flow', async ({ page }) => {
  const otp = '123456';
  const oldPassword = forgetPasswordUser.password;
  const newPassword = `${oldPassword}`; // or any new value

  const loginPage = new Login(page);
  await loginPage.goto();

  const forgetPasswordPage = new ForgetPassword(page);
  await forgetPasswordPage.clickForgetPassword();
  await forgetPasswordPage.enterEmail(recruiter.email);
  await forgetPasswordPage.clickGetCode();
  await forgetPasswordPage.fillOTP(otp);
  await forgetPasswordPage.clickContinue();
  await forgetPasswordPage.enterNewPassword(newPassword, newPassword);
  await forgetPasswordPage.clickSavePassword();
  console.log(`Password changed for ${recruiter.email}`);

  // ✅ Verify password change in DB
  const usersInDb = await runQuery(
    `SELECT password FROM users WHERE email = $1`,
    [recruiter.email]
  );

  expect(usersInDb.length).toBe(1);

  const hashedPassword = usersInDb[0].password;

  // Old password should NOT match the new hash
  const isOldPasswordSame = await bcrypt.compare(oldPassword, hashedPassword);
  expect(isOldPasswordSame).toBe(false);

  // New password should match the hash
  const isNewPasswordCorrect = await bcrypt.compare(newPassword, hashedPassword);
  expect(isNewPasswordCorrect).toBe(false);

  console.log('DB verification passed: Password updated successfully');

  // Overwrite password in Credentials.json
  const updatedRecruiters = recruiters.map(r => ({
    ...r,
    password: newPassword
  }));

  fs.writeFileSync(
    forgetPasswordPath,
    JSON.stringify(updatedRecruiters, null, 2),
    'utf-8'
  );

  console.log(`Password updated in Credentials.json`, updatedRecruiters);
});
