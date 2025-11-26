import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { SignupPage } from '../Pages/SignupPage.js';

test('Candidate signs up', async ({ page }) => {
  const USERS_FILE = path.join(process.cwd(), 'users.json');
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  const signupPage = new SignupPage(page);

  // Track processed emails
  const existingEmails = new Set();

  for (const user of users) {
    if (existingEmails.has(user.email)) {
      console.log(`Skipping already processed user: ${user.email}`);
      continue;
    }

    try {
      await signupPage.goto();
      await signupPage.register();

      await signupPage.signup(user.fullName, user.email, user.password, user.password);

      await signupPage.createAccount(); // includes 3s wait

      console.log(`Signed up user: ${user.email}`);
      existingEmails.add(user.email);

      // Optional: clear form for next iteration
      await signupPage.clearInputs();
      
    } catch (error) {
      console.log(`Failed to sign up user: ${user.email}. Skipping to next.`);
      existingEmails.add(user.email); // mark as processed to skip next time
      
      continue;
    }
  }
});
