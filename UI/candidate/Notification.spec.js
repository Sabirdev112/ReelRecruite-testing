import { test } from '@playwright/test';
import { Login } from '../../Pages/Login.js';
import { NotificationPage } from '../../Pages/Notification.js';

test('Notification flow – handle empty & existing notifications', async ({
  page,
}) => {
  const login = new Login(page);
  const notification = new NotificationPage(page);

  await login.goto();
  await login.login('khurrramimran908@gmail.com', 'Tech@12345');
  await login.clickSignIn();
  await page.waitForLoadState('networkidle');

  await notification.handleNotificationsFlow();

  console.log('Notification flow executed successfully');
});
