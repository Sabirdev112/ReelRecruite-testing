import { test, expect } from '../../fixtures/base.fixtures.js';
import { loadCredentials } from '../../utils/candidateCredentials.js';


import { getUserByEmail } from '../../utils/candidateDb.helper.js';


const candidate = loadCredentials()[0];

test('candidate can update about section', async ({ page, loginPage, updateAboutPage }) => {
  
  

  await loginPage.goto();
  await loginPage.login(candidate.email, candidate.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/jobs');
 
  await updateAboutPage.clickProfile()
  await updateAboutPage.openProfile();
  await updateAboutPage.clickEditAbout();
  await updateAboutPage.updateBio('Experienced software engineer with a passion for developing innovative programs that expedite the efficiency and effectiveness of organizational success.');
  await updateAboutPage.updateCountry('United States');
  await updateAboutPage.updateLocation('San Francisco, CA');
  await updateAboutPage.saveChanges();

  // Verify DB
  const db = await getUserByEmail(candidate.email);
  expect(db.bio).toContain('Experienced software engineer');
  expect(db.country).toBe('United States');
  expect(db.location).toBe('San Francisco, CA');
});
  

