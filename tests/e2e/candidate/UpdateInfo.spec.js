import {test, expect} from '../../fixtures/base.fixtures.js';
import {loadCredentials}from '../../utils/candidateCredentials.js';


import { getUserByEmail } from '../../utils/candidateDb.helper.js';

const candidate = loadCredentials()[0];

test('Candidate info, profile picture, and banner update', async ({ page, loginPage, updateInfo }) => {
  
   
  await loginPage.goto();
  await loginPage.login(candidate.email, candidate.password);
  await loginPage.clickSignIn();

  await updateInfo.openProfileMenu();
  await updateInfo.clickProfile();
  await updateInfo.clickEditProfile();
  await updateInfo.uploadCoverImage();
  await updateInfo.uploadProfilePicture();
  await updateInfo.fillFullName('Sabir SQA');
  await updateInfo.fillProfessionalTitle('Senior QA Engineer');
  await updateInfo.clickSaveChanges();

  // Verify DB
  const db = await getUserByEmail(candidate.email);
  expect(db.full_name).toBe('Sabir SQA');
  expect(db.title).toBe('Senior QA Engineer');
  expect(db.avatar_url).toBeTruthy();
  expect(db.cover_url).toBeTruthy();
});

