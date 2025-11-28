import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage.js';
import { CreateJobPage } from '../Pages/CreateJobPage.js';

test('Login and create a new job', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const createJobPage = new CreateJobPage(page);

  await loginPage.goto();
  await loginPage.login('carlos@gmail.com', 'Carlos@123');
  await loginPage.clickSignIn();

  await createJobPage.openJobForm();
  await createJobPage.fillJobDetails();
  await createJobPage.fillJobTypeAndCompensation();  // Step 2
  await createJobPage.fillJobDescription();
  await createJobPage.addSkills();
  await createJobPage.fillRequirements();
  await createJobPage.addQuestions();
  await createJobPage.previewJob();
  await createJobPage.submitJob();

  
});
