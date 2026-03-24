import {test, expect} from '../fixtures/base.fixtures.js';
import {runQuery} from '../utils/db/dbClient.js';
import { loadCredentials } from '../utils/recruiterCredentials.js';

const recruiter = loadCredentials()[0];
test ('Recruiter logs in successfully', async ({loginPage}) => {

  await loginPage.goto();
  await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();

  // Verify user exists in DB
  const users = await runQuery(
    `
    SELECT id, email
    FROM users
    WHERE email = $1
    `,
    ['carlos@gmail.com']
  );

  expect(users.length).toBe(1);
  expect(users[0].email).toBe('carlos@gmail.com');

  console.log('DB verification passed: User exists');
});

