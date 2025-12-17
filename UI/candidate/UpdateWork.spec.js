import { test, expect } from '@playwright/test';
import { Login } from '../../Pages/Login.js';
import { UpdateWorkPage } from '../../Pages/UpdateWork.js';

/* =======================
   Helper: Login & Open Profile
======================= */
async function loginAndOpenProfile(page) {
  const loginPage = new Login(page);
  const updateWorkPage = new UpdateWorkPage(page);

  await loginPage.goto();
  await loginPage.login('khurrramimran908@gmail.com', 'Tech@12345');
  await loginPage.clickSignIn();

  await page.waitForLoadState('networkidle');
  await updateWorkPage.openProfile();

  return updateWorkPage;
}

/* =======================
   Tests
======================= */
test.describe('Work Experience Tests', () => {

  test('candidate can update existing work experience', async ({ page }) => {
    const updateWork = await loginAndOpenProfile(page);

    await updateWork.updateWork({
      company: 'Tech Solutions Inc',
      jobTitle: 'Senior Software Engineer',
      employmentType: 'Full-time',
      locationType: 'On-site',
      startDate: '2020-01-15',
      endDate: '2023-12-31',
      isPresent: false,
      description: 'Led a team of 5 developers and implemented automated testing frameworks',
      achievements: [
        'Increased test coverage by 40%',
        'Reduced bug reports by 30%',
      ],
      skills: ['JavaScript', 'Playwright'],
    });

    // Optional assertion
    await expect(page.getByText('Tech Solutions Inc')).toBeVisible();
  });

//   test('candidate can add new work experience (hybrid, part-time)', async ({ page }) => {
//     const updateWork = await loginAndOpenProfile(page);

//     await updateWork.addNewWorkExperience({
//       company: 'Innovation Labs',
//       jobTitle: 'QA Lead',
//       employmentType: 'Part-time',
//       locationType: 'Hybrid',
//       startDate: '2024-01-01',
//       isPresent: true,
//       description: 'Leading QA initiatives and automation strategies',
//       achievements: ['Implemented new testing framework'],
//       skills: ['Playwright', 'Test Automation'],
//     });

//     await expect(page.getByText('Innovation Labs')).toBeVisible();
//   });

//   test('candidate can add contract onsite work experience', async ({ page }) => {
//     const updateWork = await loginAndOpenProfile(page);

//     await updateWork.addNewWorkExperience({
//       company: 'Contract Corp',
//       jobTitle: 'Automation Engineer',
//       employmentType: 'Contract',
//       locationType: 'On-site',
//       startDate: '2023-05-01',
//       endDate: '2023-11-30',
//       isPresent: false,
//       description: 'Short-term automation project',
//       achievements: ['Delivered project on time'],
//       skills: ['Selenium'],
//     });

//     await expect(page.getByText('Contract Corp')).toBeVisible();
//   });

//   test('candidate can add freelancer remote experience', async ({ page }) => {
//     const updateWork = await loginAndOpenProfile(page);

//     await updateWork.addNewWorkExperience({
//       company: 'Freelance Clients',
//       jobTitle: 'Independent Test Consultant',
//       employmentType: 'Freelancer',
//       locationType: 'Remote',
//       startDate: '2021-03-01',
//       endDate: '2022-02-28',
//       isPresent: false,
//       description: 'Provided testing consultancy to multiple clients',
//       achievements: [
//         'Helped 10+ companies improve QA processes',
//         '95% client satisfaction rate',
//       ],
//       skills: ['Cypress', 'Jest'],
//     });

//     await expect(page.getByText('Freelance Clients')).toBeVisible();
//   });

//   test('candidate can add work experience with minimal fields', async ({ page }) => {
//     const updateWork = await loginAndOpenProfile(page);

//     await updateWork.addNewWorkExperience({
//       company: 'Simple Corp',
//       jobTitle: 'Tester',
//       employmentType: 'Full-time',
//       locationType: 'On-site',
//       startDate: '2018-01-01',
//       endDate: '2019-12-31',
//       isPresent: false,
//     });

//     await expect(page.getByText('Simple Corp')).toBeVisible();
//   });

});
