import { test, expect } from '@playwright/test';
import { Login } from '../../Pages/Login.js';
import { UpdateResumePage } from '../../Pages/UpdateResume.js';
async function loginAndNavigateToProfile(page) {
  const loginPage = new Login(page);
  const updateResume = new UpdateResumePage(page);

  await loginPage.goto();
  await loginPage.login('khurrramimran908@gmail.com', 'Tech@12345');
  await loginPage.clickSignIn();
  await page.waitForLoadState('networkidle');

  await updateResume.clickProfile();
  await updateResume.openProfile();

  return updateResume;
}

test('candidate can remove and upload resume again', async ({ page }) => {
    const updateResume = await loginAndNavigateToProfile(page);
  
    await updateResume.removeAndUploadResume('./fixtures/Bold Poster.pdf');
  
    // ✅ Verify upload succeeded by checking "Remove Resume" button exists
    await expect(updateResume.removeResumeButton.first()).toBeVisible();
  });
  
