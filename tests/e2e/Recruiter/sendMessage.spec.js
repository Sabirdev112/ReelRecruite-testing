import { getRandomMessage } from '../../utils/message.helper.js';
import { loadCredentials } from '../../utils/recruiterCredentials.js';
import { test } from '../../fixtures/base.fixtures.js';



const recruiter = loadCredentials()[0];

test('recruiter logs in and sends a message', async ({ page, loginPage, sendMessagePage }) => {
  
  

  await loginPage.goto();
  await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/my-jobs');
  
  await sendMessagePage.openMessages();
  await sendMessagePage.selectMessage();
  const message = getRandomMessage();
  await sendMessagePage.sendMessage(message);

});


