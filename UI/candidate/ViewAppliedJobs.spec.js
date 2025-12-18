import {test} from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Login } from '../../Pages/Login.js';
import { viewAppliedJobPage } from '../../Pages/ViewAppliedJob.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load recruiter credentials
const user = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../fixtures/Candidate/Credentials.json'),
    'utf-8'
  )
)[0];


test ('Candidate views applied jobs', async ({ page }) => {
    // ----------- Login -----------
      const loginPage = new Login(page);
      const viewAppliedJobs = new viewAppliedJobPage(page);
    
      console.log(`Processing user: ${user.email}`);
    
      // LOGIN
      await loginPage.goto();
      await loginPage.login(user.email, user.password);
      await loginPage.clickSignIn();
    
      
      await page.waitForURL('**/jobs');
      await viewAppliedJobs.clickViewAppliedJobs();
      console.log('Navigated to Applied Jobs page successfully');
    
    });