import {test, expect} from '../../fixtures/base.fixtures.js';
import {loadCredentials} from '../../utils/recruiterCredentials.js';
import { getRecruiterFields } from '../../utils/recruiterDb.helper.js';

const recruiter = loadCredentials()[0];

test('recruiter info, profile picture, and banner update', async ({ page, loginPage, updateInfo }) => {

  await loginPage.goto();
  await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/my-jobs');
  await updateInfo.openProfileMenu();
  await updateInfo.clickProfile();
  await updateInfo.clickEditProfile();
  await updateInfo.uploadCoverImage();
  await updateInfo.applyCoverImage();
  await updateInfo.uploadProfilePicture();
  await updateInfo.applyProfilePicture();
  await updateInfo.fillFullName('Sabir SQA');
  await updateInfo.fillProfessionalTitle('Senior QA Engineer');
  await updateInfo.clickSaveChanges();

  // Verify DB changes
  const db = await getRecruiterFields(recruiter.email);
  expect(db.full_name).toBe('Sabir SQA');
  expect(db.title).toBe('Senior QA Engineer');
  expect(db.avatar_url).toBeTruthy();
  expect (db.cover_url).toBeTruthy();
});

