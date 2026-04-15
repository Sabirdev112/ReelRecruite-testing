import { test, chromium } from '../../fixtures/base.fixtures.js';
import { loadCredentials } from '../../utils/candidateCredentials.js';
import { getLatestJobId } from '../../utils/job.helper.js';
import { storeApplicationId } from '../../utils/application.helper.js';
import { getApplicationIdForCandidate } from '../../utils/applicationDb.helper.js';


test('Apply for latest job (users from JSON)', async ({ page, loginPage, applyJobPage }) => {

      const browser = await chromium.launch({ headless: false });
      const user = loadCredentials()[0];
      const jobUrl = getLatestJobId();

      const context = await browser.newContext({ permissions: ['camera', 'microphone'] });

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


