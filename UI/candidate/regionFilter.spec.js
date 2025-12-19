import { test, expect } from '@playwright/test';
import { Login } from '../../Pages/Login.js';
import { FilterPage } from '../../Pages/Filter.js';

test('Apply Region filter', async ({ page }) => {
  const login = new Login(page);
  const filter = new FilterPage(page);

  await login.goto();
  await login.login('khurrramimran908@gmail.com', 'Tech@12345');
  await login.clickSignIn();
  await page.waitForLoadState('networkidle');

  await filter.applyRegionFilter();

  await expect(page).toHaveURL(/jobs|search/);
  console.log('✅ Region filter applied');
});
