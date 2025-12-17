import { test, expect } from '@playwright/test';
import { Login } from '../../Pages/Login.js';
import { UpdateAboutPage } from '../../Pages/UpdateAbout.js';

test('candidate can update about section', async ({ page }) => {
  const loginPage = new Login(page);
  const updateAbout = new UpdateAboutPage(page);

  await loginPage.goto();
  await loginPage.login('khurrramimran908@gmail.com', 'Tech@12345');
  await loginPage.clickSignIn();
  await page.waitForLoadState('networkidle'); // optional
  await updateAbout.clickProfile()
  await updateAbout.openProfile();
  await updateAbout.clickEditAbout();

  await updateAbout.updateAbout({
    bio: 'sqa engineer with 1 years experience',
    country: 'Pakistan',
    phone: '92310232322',
    location: 'Lahore',
  });
});
  // Optional: add an assertion if there is some confirmation text
  // await expect(page.getByText('Profile updated successfully')).toBeVisible();