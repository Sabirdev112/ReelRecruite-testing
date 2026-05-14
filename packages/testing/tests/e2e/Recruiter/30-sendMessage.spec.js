import { getRandomMessage } from '../../utils/message.helper.js';
import { loadCredentials } from '../../utils/recruiterCredentials.js';
import { test } from '../../fixtures/base.fixtures.js';
import { getLatestJobUrl } from '../../utils/job.helper.js';

const recruiter = loadCredentials()[0];
const message = getRandomMessage();
const jobUrl = getLatestJobUrl();

test('recruiter logs in and sends a message', async ({ page, loginPage, sendMessagePage }) => {
  
  await loginPage.goto();
  await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/my-jobs');
  await page.goto(jobUrl);
  await sendMessagePage.clickViewApplications();
  await sendMessagePage.clickViewDetails();
  await sendMessagePage.selectMessage();
  await sendMessagePage.sendMessage(message);

});


