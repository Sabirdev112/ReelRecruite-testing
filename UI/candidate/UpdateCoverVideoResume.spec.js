import { test, expect } from '@playwright/test';
import { Login } from '../../Pages/Login.js';
import {UpdateCoverVideoResumePage} from '../../Pages/UpdateCoverVideoResume.js';
import path from 'path';

test.describe('Cover Video Resume Upload Test', () => {
  const fixtureVideoPath = path.resolve('./fixtures/sample-video.mp4');

  test('candidate can upload a video resume', async ({ page }) => {
    const loginPage = new Login(page);
    const coverVideoPage = new UpdateCoverVideoResumePage(page);

    // Navigate and login
    await loginPage.goto();
    await loginPage.login('khurrramimran908@gmail.com', 'Tech@12345');
    await loginPage.clickSignIn();
    await page.waitForLoadState('networkidle');

    // Navigate to profile
    await coverVideoPage.clickProfile();
    await coverVideoPage.openProfile();
    await coverVideoPage.removeVideo();
    console.log('Existing video removed if present.');

    // Upload video
    await coverVideoPage.uploadVideo(fixtureVideoPath);
    console.log('Video upload initiated.');
    
    // Verify upload
    await expect(coverVideoPage.removeVideoButton).toBeVisible({ timeout: 10000 });
  });
});
