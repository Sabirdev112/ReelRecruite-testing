import { test, expect } from '../../fixtures/base.fixtures.js';
import { loadCredentials } from '../../utils/candidateCredentials.js';
import { getCandidateWorkExperience, getCandidateProfileByEmail } from '../../utils/candidateDb.helper.js';

const candidate = loadCredentials()[0];

test('Candidate adds experience', async ({ page, loginPage, updateWork }) => {
  
  await loginPage.goto();
  await loginPage.login(candidate.email, candidate.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/jobs');
  await updateWork.openProfileDropdown();
  await updateWork.openProfile();
  await updateWork.navigateToWorkSection();
  await updateWork.deleteIfVisibleAndProceed();
  await updateWork.clickAddWork();
  await updateWork.addCompany('Tech Solutions Inc');
  await updateWork.addPosition('Senior Software Engineer');
  await updateWork.addEmploymentType('Full-time');
  await updateWork.addLocationType('On-site');
  await updateWork.addStartDate('2021-01-01');
  await updateWork.addEndDate();
  await updateWork.addDescription('Led QA automation initiatives and improved delivery quality');
  await updateWork.addAchievement(['Reduced regression failures by 40%','Introduced Playwright automation']);
  await updateWork.addSkill(['Playwright','JavaScript']);
  await updateWork.saveChanges();

  // Verify DB using helper
  const profile = await getCandidateProfileByEmail(candidate.email);
  const userId = profile ? (profile.user_id || profile.userId) : null;
  const work = userId ? await getCandidateWorkExperience(userId) : null;
  expect(JSON.stringify(work)).toContain('Tech Solutions Inc');
});


