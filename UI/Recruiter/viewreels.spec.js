import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Login } from '../../Pages/Login.js';
import { ViewReelsPage } from '../../Pages/ViewReels.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load recruiter credentials
const recruiter = JSON.parse(
    fs.readFileSync(
        path.join(__dirname, '../../fixtures/Recruiter/Credentials.json'),
        'utf-8'
    )
)[0];

// Load job ID
const { jobId } = JSON.parse(
    fs.readFileSync(
        path.join(__dirname, '../../fixtures/Recruiter/jobid.json'),
        'utf-8'
    )
);

// Construct job URL
const jobUrl = `https://recruitai-web-production.up.railway.app/jobs/${jobId}`;

test('Recruiter can view reels and scroll', async ({ page }) => {
    // ----------- Login -----------
    const loginPage = new Login(page);
    await loginPage.goto();
    await loginPage.login(recruiter.email, recruiter.password);
    await loginPage.clickSignIn();
    await page.waitForURL('**/my-jobs');

    // ----------- Navigate to job -----------
    await page.goto(jobUrl, { waitUntil: 'domcontentloaded' });
    console.log(`Successfully navigated to Job URL: ${jobUrl}`);

    // ----------- View reels & Scroll -----------
    const viewReelsPage = new ViewReelsPage(page);

    // Click View Reels
    await viewReelsPage.navigateToViewReels();
    console.log('Clicked "View Reels" button');
    await viewReelsPage.scrollToReel(viewReelsPage.scrollLocator);
    console.log('Performed scroll action');

});
