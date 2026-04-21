import { test } from '../../fixtures/base.fixtures.js';
import { loadCredentials } from '../../utils/candidateCredentials.js';
import { getLatestJobId } from '../../utils/job.helper.js';
import { storeApplicationId } from '../../utils/application.helper.js';
import { getApplicationIdForCandidate } from '../../utils/applicationDb.helper.js';

// Grant camera and microphone permissions for this test
test.use({ permissions: ['camera', 'microphone'] });

test('Apply for latest job', async ({ page, loginPage, applyJobPage }) => {
    const user = loadCredentials()[0];
    const jobUrl = getLatestJobId();
    const jobId = jobUrl.split('/').pop();

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
      }
});
