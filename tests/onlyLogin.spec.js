import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

import { LoginPage } from '../Pages/LoginPage.js';

test('Candidate logs in', async ({ page }) => {
  const USERS_FILE = path.join(process.cwd(), 'users.json');
  
  // Read all users
  function getUsers() {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  }
  
  // Store already used emails in memory
  const usedEmails = new Set();
  
  // Select a random user NOT used before
  function getRandomUnusedUser(users) {
    const unused = users.filter(u => !usedEmails.has(u.email));
  
    if (unused.length === 0) return null; // all used
  
    const randomIndex = Math.floor(Math.random() * unused.length);
    const selected = unused[randomIndex];
  
    usedEmails.add(selected.email);
    return selected;
  }

  const users = getUsers();
  const loginPage = new LoginPage(page);

  for (let i = 0; i < users.length; i++) {
    const user = getRandomUnusedUser(users);
    if (!user) {
      console.log("All users from JSON have been used.");
      break;
    }

    console.log(`Logging in user: ${user.email}`);
    await loginPage.goto();
    await loginPage.login(user.email, user.password);
    await loginPage.clickSignIn();
    await page.waitForTimeout(10000);
  }
});