import {test, expect} from '../fixtures/base.fixtures.js';
import {runQuery} from '../utils/db/dbClient.js';
import { loadCredentials } from '../utils/recruiterCredentials.js';

const recruiter = loadCredentials()[0];

test ('Recruiter logs in successfully', async ({loginPage}) => {

  await loginPage.goto();
  await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();
  await loginPage.logout();

});
