import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage.js';
import { ApplyJobPage } from '../Pages/ApplyJobPage.js';

test.use({
  colorScheme: 'dark',
  viewport: { height: 600, width: 800 },
});

test('Candidate logs in and applies for a job', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const applyJobPage = new ApplyJobPage(page);

  // Step 1: Login as Candidate
  await loginPage.goto();
  await loginPage.login('muhammadsabir.dev@gmail.com', 'Sabir@123');
  

  // Step 2: Select a Job and Apply
  await applyJobPage.openJobAndApply();

  // Step 3: Record Video
  await applyJobPage.recordVideo();

  // Step 4: Answer application question
  await applyJobPage.answerQuestion('I am passionate about testing and automation.');

  // Step 5: Submit the application
  await applyJobPage.submitApplication();

  // Step 6: Verify submission
  await expect(page.getByText(/Application submitted successfully/i)).toBeVisible({ timeout: 5000 });
});
