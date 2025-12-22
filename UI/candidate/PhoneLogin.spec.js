import {test} from '@playwright/test';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {Login} from '../../Pages/Login.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const recruiter = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../fixtures/Recruiter/Credentials.json'),
    'utf-8'
  )
)[0];


test('Candidate can log in using phone number', async ({ page }) => {
    const loginPage = new Login(page);
    await loginPage.goto();
    await loginPage.phoneLogin(recruiter.phone);
    await loginPage.clickSignIn();
    console.log('Candidate logged in successfully using phone number');
}); 