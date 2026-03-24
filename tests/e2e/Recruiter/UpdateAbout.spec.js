import { test, expect } from '../../fixtures/base.fixtures.js';
import { loadCredentials } from '../../utils/recruiterCredentials.js';


import { getUserByEmail } from '../../utils/recruiterDb.helper.js';


const recruiter = loadCredentials()[0];

test('recruiter can update about section', async ({ page, loginPage, updateAboutPage }) => {
  
  

  await loginPage.goto();
  await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/my-jobs');
  
  await updateAboutPage.clickProfile()
  await updateAboutPage.openProfile();
  await updateAboutPage.clickEditAbout();
  await updateAboutPage.updateBio('Experienced software engineer with a passion for developing innovative programs that expedite the efficiency and effectiveness of organizational success.');
  await updateAboutPage.updateCountry('United States');
  await updateAboutPage.updateLocation('San Francisco, CA');
  await updateAboutPage.saveChanges();
  
  // Verify DB
  const db = await getUserByEmail(recruiter.email);
  expect(db.bio).toContain('Experienced software engineer');
  expect(db.country).toBe('United States');
  expect(db.location).toBe('San Francisco, CA');
});


