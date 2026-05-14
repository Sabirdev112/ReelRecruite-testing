import { test } from '../fixtures/base.fixtures.js';
import {getRandomUser, storeNewUser, writeUsersJson} from '../utils/signupCredentials.helper.js';
import { approveRecruiter, verifyUserCreated } from '../utils/signupDb.helper.js';

test.describe.configure({ mode: 'serial' });

async function signUp(signupPage, user, roleLabel) {
  await signupPage.goto();
  await signupPage.register();
  await signupPage.enterFullName(user.fullName);
  await signupPage.enterEmail(user.email);
  await signupPage.enterPhone(user.phone);
  await signupPage.enterPassword(user.password);
  await signupPage.enterConfirmPassword(user.password);
  await signupPage.selectRole(roleLabel);
  await signupPage.createAccount();
  await signupPage.fillOTP('123456');
}

test('Candidate signs up', async ({ signupPage }) => {
  const candidate = getRandomUser();
  await signUp(signupPage, candidate, 'Job Seeker');

  const dbRow = await verifyUserCreated(candidate.email);

  writeUsersJson({
    candidate: {
      id: dbRow.id,
      fullName: candidate.fullName,
      email: candidate.email,
      phone: dbRow.phone,
      password: candidate.password,
    },
  });

  storeNewUser({ ...candidate, userType: 'candidate' });
});

test('Recruiter signs up', async ({ signupPage }) => {
  const recruiter = getRandomUser();
  await signUp(signupPage, recruiter, 'Recruiter');

  const dbRow = await verifyUserCreated(recruiter.email);

  // New recruiters require admin approval (is_approved=false) before they
  // can use recruiter-only endpoints. Bypass that gate in the DB so the rest
  // of the suite can run end-to-end.
  await approveRecruiter(recruiter.email);

  writeUsersJson({
    recruiter: {
      id: dbRow.id,
      fullName: recruiter.fullName,
      email: recruiter.email,
      phone: dbRow.phone,
      password: recruiter.password,
    },
  });

  storeNewUser({ ...recruiter, userType: 'recruiter' });
});
