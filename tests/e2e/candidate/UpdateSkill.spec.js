import { test, expect } from '../../fixtures/base.fixtures.js';
import { loadCredentials } from '../../utils/candidateCredentials.js';

import { getCandidateSkills, getCandidateProfileByEmail } from '../../utils/candidateDb.helper.js';


const candidate = loadCredentials()[0];


test('candidate can update skills section', async ({ page, loginPage, updateSkils }) => {
  
  

  await loginPage.goto();
  await loginPage.login(candidate.email, candidate.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/jobs');
  
  await updateSkils.clickProfile();
  await updateSkils.openProfile();
  await updateSkils.clickEditSkills();
  await updateSkils.updateSkills([
    'JavaScript',
    'Playwright',
    'Selenium',
    'Test Automation']);

  // Verify DB using helper
  const profile = await getCandidateProfileByEmail(candidate.email);
  const userId = profile ? (profile.user_id || profile.userId) : null;
  const skills = userId ? await getCandidateSkills(userId) : null;
  expect(skills).toEqual(expect.arrayContaining(['JavaScript','Playwright','Selenium','Test Automation']));
});




