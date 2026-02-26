import { test, chromium } from '@playwright/test';
import { Login } from '../../Pages/Login.js';
import { ApplyJobPage } from '../../Pages/ApplyJobPage.js';
import { loadCredentials } from '../../support/candidateCredentials.js';
import { getLatestJobId, buildJobUrl } from '../../support/job.helper.js';
import { storeApplicationId } from '../../support/application.helper.js';
import { getApplicationIdForCandidate } from '../../support/applicationDb.helper.js';

const users = loadCredentials();
const jobId = getLatestJobId();
const jobUrl = buildJobUrl(jobId);

// bump test timeout locally to avoid hitting playwright.config.js limit
// especially since we loop through multiple users and record videos
test.setTimeout(600_000);

test('Apply for latest job (users from JSON)', async () => {
  const browser = await chromium.launch({ headless: false });

  for (const user of users) {
    console.log(`\nProcessing user: ${user.email}`);
    const context = await browser.newContext({ permissions: ['camera', 'microphone'] });
    const page = await context.newPage();

    try {
      const loginPage = new Login(page);
      const applyJobPage = new ApplyJobPage(page);
      await loginPage.goto();
      await loginPage.login(user.email, user.password);
      await loginPage.clickSignIn();
      await page.waitForURL('**/jobs');

      await page.goto(jobUrl);
      await applyJobPage.applyNow();
      await applyJobPage.recordVideo();
      await page.waitForTimeout(10000);
      await applyJobPage.stopRecording();
      await applyJobPage.answerOne();
      await applyJobPage.answerTwo();
      await applyJobPage.submitApplication();

      const applicationId = await getApplicationIdForCandidate(user.email, jobId);

      if (applicationId) {
        storeApplicationId(applicationId);
        console.log(`Application succeeded for ${user.email}: ${applicationId}`);
      } else {
        console.log(`No application recorded for ${user.email}.`);
      }
    } catch (err) {
      console.log(`Error processing ${user.email}:`, err.message || err);
    } finally {
      await context.close();
    }
  }

  await browser.close();
});
