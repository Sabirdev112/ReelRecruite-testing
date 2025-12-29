import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { SignupPage } from '../Pages/SignupPage.js';
import { runQuery } from '../utils/db/dbClient.js';
const RANDOM_USERS_FILE = path.join(process.cwd(), 'fixtures/users/RandomUsers.json');
const NEW_USERS_FILE = path.join(process.cwd(), 'fixtures/users/NewUsers.json');

test('Candidate signs up and moves user from RandomUsers to NewUsers', async ({ page }) => {
  const signupPage = new SignupPage(page);

  // Load random users
  let randomUsers = JSON.parse(fs.readFileSync(RANDOM_USERS_FILE, 'utf-8'));

  if (!randomUsers.length) {
    console.log('No users left in RandomUsers.json');
    return;
  }

  // Load already signed up users
  let newUsers = fs.existsSync(NEW_USERS_FILE)
    ? JSON.parse(fs.readFileSync(NEW_USERS_FILE, 'utf-8'))
    : [];

  // 🔹 Pick first user and remove immediately
  const user = randomUsers.shift();

  // Persist removal immediately (prevents re-use on crash)
  fs.writeFileSync(
    RANDOM_USERS_FILE,
    JSON.stringify(randomUsers, null, 2),
    'utf-8'
  );

  try {
    await signupPage.goto();
    await signupPage.register();

    await signupPage.enterFullName(user.fullName);
    await signupPage.enterEmail(user.email);
    await signupPage.enterPhone(user.phone);
    await signupPage.enterPassword(user.password);
    await signupPage.enterConfirmPassword(user.password);
    await signupPage.selectRole('Job Seeker');

    await signupPage.createAccount();

    // OTP
    await signupPage.fillOTP('123456');

    console.log(`Signed up successfully: ${user.email}`);

    // ✅ Verify user exists in DB
    const usersInDb = await runQuery(
      `
      SELECT id, email
      FROM users
      WHERE email = $1
      `,
      [user.email]
    );

    expect(usersInDb.length).toBe(1);
    expect(usersInDb[0].email).toBe(user.email);
    console.log('DB verification passed: User Created in db');

    // ✅ Move to NewUsers.json
    newUsers.push(user);
    fs.mkdirSync(path.dirname(NEW_USERS_FILE), { recursive: true });
    fs.writeFileSync(
      NEW_USERS_FILE,
      JSON.stringify(newUsers, null, 2),
      'utf-8'
    );

  } catch (error) {
    console.log(`Signup failed for ${user.email}: ${error.message}`);
  } finally {
    // ✅ Hard stop – no hanging tests
    await page.context().close();
  }
});
