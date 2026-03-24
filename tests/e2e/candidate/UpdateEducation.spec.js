import { test, expect } from '../../fixtures/base.fixtures.js';

import { loadCredentials } from '../../utils/candidateCredentials.js';

import { getCandidateEducation, getCandidateProfileByEmail } from '../../utils/candidateDb.helper.js';

const candidate = loadCredentials()[0];

test('candidate can update education', async ({ page, loginPage, updateEducation }) => {
  
  
  await loginPage.goto();
  await loginPage.login(candidate.email, candidate.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/jobs');

  await updateEducation.clickProfile();
  await updateEducation.openProfile();
  await updateEducation.navigateToEducation();
  await updateEducation.deleteIfVisibleAndProceed();
  await updateEducation.clickAddEducation();
  await updateEducation.updateSchool('Harvard University');
  await updateEducation.updateDegree('Bachelor of Science');
  await updateEducation.updateFieldOfStudy('Computer Science');
  await updateEducation.updateGPA('4.0');
  await updateEducation.updateLocation('Boston, MA');
  await updateEducation.updateStartDate('2021-01-01');
  await updateEducation.updateEndDate(); 
  await updateEducation.updateDescription('Graduated with honors.');
  await updateEducation.saveChanges();

  // Verify DB using helper
  const profile = await getCandidateProfileByEmail(candidate.email);
  const userId = profile ? (profile.user_id || profile.userId) : null;
  const education = userId ? await getCandidateEducation(userId) : null;
  expect(education).toBeTruthy();
  const eduStr = JSON.stringify(education);

  // Verify all fields we updated are present in the stored education JSON
  expect(eduStr).toContain('Harvard University');
  expect(eduStr).toContain('Bachelor of Science');
  expect(eduStr).toContain('Computer Science');
  expect(eduStr).toContain('4.0');
  expect(eduStr).toContain('Boston, MA');
  expect(eduStr).toContain('2021-01-01');
  expect(eduStr).toContain('Graduated with honors.');
});


