import { test, } from '@playwright/test';
import { LoginPage } from '../../Pages/LoginPage.js';
import { CreateJobPage } from '../../Pages/CreateJobPage.js';

test('Login and create a new job', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const createJobPage = new CreateJobPage(page);

  // ✅ Correct login flow (MATCHES LoginPage.js)
  await loginPage.goto();
  await loginPage.login('carlos@gmail.com', 'Carlos@123');
  await loginPage.clickSignIn();
  // await createJobPage.Cancel();
  await page.waitForTimeout(3000);
  await createJobPage.openJobForm();
  await createJobPage.fillJobDetails();
  await createJobPage.fillJobTypeAndCompensation();
  await createJobPage.fillJobDescription();
  await createJobPage.addSkills();
  await createJobPage.fillRequirements();
  await createJobPage.addQuestions();

  await page.waitForTimeout(3000);
  await createJobPage.previewJob();

  await page.waitForTimeout(3000);
  await createJobPage.submitJob();
  await createJobPage.seeAllApplications();
  await page.waitForTimeout(5000);
});
