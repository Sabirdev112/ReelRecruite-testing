import { promises as fs } from 'fs';
import { expect } from '@playwright/test';

export class ChangePassword {
  constructor(page) {
    this.page = page;

    this.profileMenu = page.locator('//*[@id="root"]/div[2]/header/div/div[2]/div[2]/div[1]/div/div[1]/div');
    this.settingsButton = page.getByText('Settings', { exact: true });
    this.oldPasswordInput = page.getByRole('textbox', { name: 'Enter your existing password' });
    this.newPasswordInput = page.getByRole('textbox', { name: 'New password' });
    this.saveChangesButton = page.getByRole('button', { name: 'Update password' });
    this.maybeLaterButton = page.getByRole('button', { name: 'Maybe Later' });
  }

  async handleMaybeLaterIfPresent() {
    if (await this.maybeLaterButton.isVisible()) {
      await expect(this.maybeLaterButton).toBeVisible();
      await this.maybeLaterButton.click();
      await expect(this.maybeLaterButton).toBeHidden();
      
    }
  }

  async openProfileMenu() {
    await expect(this.profileMenu).toBeVisible();
    await this.profileMenu.click();
    await expect(this.profileMenu).toBeVisible();
    console.log('Profile menu opened.');
  }

  async navigateToSettings() {
    await expect(this.settingsButton).toBeVisible();
    await this.settingsButton.click();
    await this.page.waitForLoadState('networkidle');
    await expect(this.settingsButton).toBeVisible();
    console.log('Navigated to Settings.');
  }

 async changePassword(oldPassword, newPassword) {

  await expect(this.oldPasswordInput).toBeVisible();
  await expect(this.oldPasswordInput).toBeEnabled();
  await this.oldPasswordInput.fill(oldPassword);
  const filledOldPassword = await this.oldPasswordInput.inputValue();
  expect(filledOldPassword).toBe(oldPassword);
  await this.oldPasswordInput.blur();

  await expect(this.newPasswordInput).toBeVisible();
  await expect(this.newPasswordInput).toBeEnabled();
  await this.newPasswordInput.fill(newPassword);
  const filledNewPassword = await this.newPasswordInput.inputValue();
  expect(filledNewPassword).toBe(newPassword);
  await this.newPasswordInput.blur();

  console.log(`Password updated ${ newPassword}`);
}

  async saveChanges() {
    await expect(this.saveChangesButton).toBeVisible();
    await expect(this.saveChangesButton).toBeEnabled();
    await this.saveChangesButton.click();
    await this.page.waitForLoadState('networkidle');
    console.log('Changes saved.');
  }

  static async readCredentials(filePath) {
    if (!filePath) throw new Error('Credentials file path is required');

    const fileExists = await fs.stat(filePath).catch(() => null);
    expect(fileExists).toBeTruthy();

    const data = await fs.readFile(filePath, 'utf-8');
    expect(data).toBeTruthy();

    const candidates = JSON.parse(data);
    expect(Array.isArray(candidates) && candidates.length > 0).toBe(true);

    return candidates[0];
  }

  static async updateCredentialsJSON(filePath, email, newPassword) {
    const data = await fs.readFile(filePath, 'utf-8');
    expect(data).toBeTruthy();

    const candidates = JSON.parse(data);
    expect(Array.isArray(candidates) && candidates.length > 0).toBe(true);

    const updated = candidates.map(c =>
      c.email === email ? { ...c, password: newPassword } : c
    );

    await fs.writeFile(filePath, JSON.stringify(updated, null, 2), 'utf-8');

    const checkData = await fs.readFile(filePath, 'utf-8');
    expect(checkData).toContain(newPassword);
  }
}
