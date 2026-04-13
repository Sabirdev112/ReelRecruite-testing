import { test, chromium } from '../../fixtures/base.fixtures.js';
import { Login } from '../../pages/Login.js';
import { ApplyJobPage } from '../../pages/ApplyJobPage.js';
import { loadCredentials } from '../../utils/candidateCredentials.js';
import { getLatestJobId, buildJobUrl } from '../../utils/job.helper.js';
import { storeApplicationId } from '../../utils/application.helper.js';
import { getApplicationIdForCandidate } from '../../utils/applicationDb.helper.js';

const users = loadCredentials();
const jobId = getLatestJobId();
const jobUrl = buildJobUrl(jobId);

// bump test timeout locally to avoid hitting playwright.config.js limit
// especially since we loop through multiple users and record videos
test.setTimeout(300_000);

test('Apply for latest job (users from JSON)', async () => {
   const browser = await chromium.launch({ headless: false });
   const user = loadCredentials()[0];

    const context = await browser.newContext({ permissions: ['camera', 'microphone'] });
    const page = await context.newPage();
    const loginPage = new Login(page);
    const applyJobPage = new ApplyJobPage(page);

      await loginPage.goto();
      await loginPage.login(user.email, user.password);
      await loginPage.clickSignIn();
      await page.waitForURL('**/jobs');
      await page.goto(jobUrl);

      await applyJobPage.applyNow();
      await applyJobPage.recordVideo();
      await applyJobPage.stopRecording();
      await applyJobPage.answerOne();
      await applyJobPage.answerTwo();
      await applyJobPage.submitApplication();

      const applicationId = await getApplicationIdForCandidate(user.email, jobId);

      if (applicationId) {
        storeApplicationId(applicationId);
        console.log(`✓ Application succeeded for ${user.email}: ${applicationId}`);
        await context.close();
      }
});


