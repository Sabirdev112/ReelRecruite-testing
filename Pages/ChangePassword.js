import { promises as fs } from 'fs';
import path from 'path';

export class ChangePassword {
  constructor(page) {
    this.page = page;

    // UI elements
    this.profileMenu = page.locator('xpath=//*[@id="root"]/div[2]/header/div/div[2]/div[2]/div/div/div[2]');
    this.settingsButton = page.getByText('Settings', { exact: true });
    this.oldPasswordInput = page.getByRole('textbox', { name: 'Enter your existing password' });
    this.newPasswordInput = page.getByRole('textbox', { name: 'New password' });
    this.saveChangesButton = page.getByRole('button', { name: 'Update password' });
    this.maybeLaterButton = page.getByRole('button', { name: 'Maybe Later' });
  }

   async handleMaybeLaterIfPresent() {
        try {
            await this.maybeLaterButton.waitFor({
                state: 'visible',
                timeout: 2500
            });
            await this.maybeLaterButton.click();
            await this.maybeLaterButton.waitFor({ state: 'hidden' });
        } catch {
            // Modal did not appear — safe to continue
        }
    } 

  async openProfileMenu() {
    await this.profileMenu.waitFor({ state: 'visible' });
    await this.profileMenu.click();
  }

  async navigateToSettings() {
    await this.settingsButton.waitFor({ state: 'visible' });
    await this.settingsButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async changePassword(oldPassword, newPassword) {
    if (!oldPassword || !newPassword) {
      throw new Error('Old password or new password is undefined');
    }

    // Mimic Login.js typing style
    await this.oldPasswordInput.waitFor({ state: 'visible'});
    await this.oldPasswordInput.click();
    await this.oldPasswordInput.pressSequentially(oldPassword, { delay: 40 });

    await this.newPasswordInput.waitFor({ state: 'visible' });
    await this.newPasswordInput.click();
    await this.newPasswordInput.pressSequentially(newPassword, { delay: 40 });

    await this.newPasswordInput.blur();
  }

  async saveChanges() {
    await this.saveChangesButton.waitFor({ state: 'visible' });
    await this.saveChangesButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  // ---------------- Utility Methods ----------------

  static async readCredentials(filePath) {
    if (!filePath) throw new Error('Credentials file path is required');

    const fileExists = await fs.stat(filePath).catch(() => null);
    if (!fileExists) throw new Error(`Credentials file not found at: ${filePath}`);

    const data = await fs.readFile(filePath, 'utf-8');
    if (!data) throw new Error(`Credentials file is empty: ${filePath}`);

    const candidates = JSON.parse(data);
    if (!Array.isArray(candidates) || candidates.length === 0) {
      throw new Error(`No candidate found in credentials file: ${filePath}`);
    }

    return candidates[0]; // return first candidate safely
  }

  static async updateCredentialsJSON(filePath, email, newPassword) {
    const data = await fs.readFile(filePath, 'utf-8');
    const candidates = JSON.parse(data);

    const updated = candidates.map(c =>
      c.email === email ? { ...c, password: newPassword } : c
    );

    await fs.writeFile(filePath, JSON.stringify(updated, null, 2), 'utf-8');
  }
}
