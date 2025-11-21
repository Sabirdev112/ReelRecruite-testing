import { test, expect } from '@playwright/test';

test.use({
  viewport: {
    height: 600,
    width: 800
  }
});

test('test', async ({ page }) => {
  await page.goto('https://recruitai-web-production.up.railway.app/auth');
  await page.getByRole('textbox', { name: 'Enter your username' }).click();
  await page.getByRole('textbox', { name: 'Enter your username' }).fill('carlos');
  await page.getByRole('textbox', { name: 'Enter your password' }).click();
  await page.getByRole('textbox', { name: 'Enter your password' }).fill('Carlos@123');
  await page.locator('form').getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('img', { name: 'sabir' }).click();
  await page.locator('div').filter({ hasText: /^Profile$/ }).click();
  await page.getByRole('button').nth(2).click();
  await page.getByRole('textbox', { name: 'Professional Title' }).click();
  await page.getByRole('textbox', { name: 'Professional Title' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Professional Title' }).fill('SQA Engineer');
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await page.getByRole('button').nth(3).click();
  await page.getByRole('textbox', { name: 'Phone Number' }).click();
  await page.getByRole('textbox', { name: 'Phone Number' }).fill('928378879884332');
  await page.getByRole('button', { name: 'Save Changes' }).click();
});