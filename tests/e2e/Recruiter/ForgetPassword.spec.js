import { test } from '../../fixtures/base.fixtures.js';


import { loadCredentials } from '../../utils/recruiterCredentials.js';
import { changeRecruiterPassword, verifyPasswordUpdatedInDb } from '../../utils/password.helper.js';

test('Recruiter forget password flow', async ({ page, loginPage, forgetPassword }) => {
  const recruiters = loadCredentials();
  const recruiter = recruiters[0];

  const otp = '123456';
  const oldPassword = recruiter.password;
  const newPassword = `${oldPassword}`; 
  
  await loginPage.goto();

  
  await forgetPassword.clickForgetPassword();
  await forgetPassword.enterEmail(recruiter.email);
  await forgetPassword.clickGetCode();
  await forgetPassword.fillOTP(otp);
  await forgetPassword.clickContinue();
  await forgetPassword.enterNewPassword(newPassword, newPassword);
  await forgetPassword.clickSavePassword();

  // Verify Db
  await verifyPasswordUpdatedInDb(recruiter.email, oldPassword, newPassword);

  // update credentials in json
  await changeRecruiterPassword(recruiter.email, newPassword);
  console.log(`Password updated in Credentials.json for ${recruiter.email}`);
});


