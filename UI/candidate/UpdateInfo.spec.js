import { test, expect } from '@playwright/test';
import { Login } from '../../Pages/Login.js';
import { UpdateInfoPage } from '../../Pages/UpdateInfo.js';

test('candidate can update info section', async ({ page }) => {
  const loginPage = new Login(page);
  const updateInfo = new UpdateInfoPage(page);

  await loginPage.goto();
  await loginPage.login('khurrramimran908@gmail.com', 'Tech@12345');
  await loginPage.clickSignIn();
  await page.waitForLoadState('networkidle');
  await updateInfo.clickProfile();
  await updateInfo.openProfile();
  
  // Wait for profile page to fully load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  
  // Click main Edit Profile button to enter edit mode
  await updateInfo.clickEditProfile();
  
  // Optional: Click cover image button (if needed)
  // await updateInfo.clickCoverImage();
  // await updateInfo.uploadCoverImage('path/to/cover-image.jpg');
  
  // Optional: Click profile picture button (if needed)
  // await updateInfo.clickProfilePicture();
  // await updateInfo.uploadProfilePicture('path/to/profile-picture.jpg');
  
  // updateInfo() method already calls clickEditInfo() internally
  await updateInfo.updateInfo({
    fullName: 'Khurram Imran',
    professionalTitle: 'SQA Engineer',
  });
  
  // Wait a bit for changes to reflect
  await page.waitForTimeout(2000);
  
  // Optional: Verify changes were saved
  // await expect(page.getByText('Khurram Imran')).toBeVisible();
  // await expect(page.getByText('SQA Engineer')).toBeVisible();
});

