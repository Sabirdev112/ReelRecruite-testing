import { expect } from '@playwright/test';
import { getBannerImagePath, getProfileImagePath } from '../support/profileMedia.helper.js';

export class UpdateInfoPage {
  constructor(page) {
    this.page = page;
    this.maybeLaterButton = page.getByRole('button', { name: 'Maybe Later' });
    this.profileMenu = page.locator('//*[@id="root"]/div[2]/header/div/div[2]/div[2]/div[1]/div/div[1]/div');
    this.profileButton = page.getByText('Profile', { exact: true });
    this.editProfileButton = page.locator('button.absolute.top-4.right-4');
    this.coverImageInput = page.locator('input[type="file"][accept="image/*"]').first();
    this.profilePictureInput = page.locator('input[type="file"][accept="image/*"]').nth(1);
    this.profilePictureEditButton = page.locator('button.absolute.bottom-2.right-2');

    this.fullNameTextbox = page.getByRole('textbox', { name: /Full Name\*/i });
    this.professionalTitleTextbox = page.getByRole('textbox', { name: /Professional Title\*/i });

    this.saveChangesButton = page.getByRole('button', { name: /Save Changes/i });
    this.cancelButton = page.getByRole('button', { name: /Cancel/i });
  }

  async handleMaybeLaterIfPresent() {
    try {
      await this.maybeLaterButton.waitFor({ state: 'visible', timeout: 2500 });
      await expect(this.maybeLaterButton).toBeVisible();
      await this.maybeLaterButton.click();
      await expect(this.maybeLaterButton).toBeHidden();
    } catch {}
  }

  async openProfileMenu() {
    await this.profileMenu.waitFor({ state: 'visible' });
    await expect(this.profileMenu).toBeVisible();
    await this.profileMenu.click();
    console.log('Profile menu opened');
  }

  async clickProfile() {
    await this.profileButton.waitFor({ state: 'visible' });
    await expect(this.profileButton).toBeVisible();
    await this.profileButton.click();
    await this.page.waitForLoadState('networkidle');
    console.log('Navigated to profile page');
  }

  async clickEditProfile() {
    await this.editProfileButton.waitFor({ state: 'visible' });
    await expect(this.editProfileButton).toBeVisible();
    await this.editProfileButton.click();
    console.log('Edit profile button clicked');
  }

  async uploadCoverImage() {
    await this.handleMaybeLaterIfPresent();
    const bannerPath = getBannerImagePath();

    await this.coverImageInput.waitFor({ state: 'attached' });
    await this.coverImageInput.setInputFiles(bannerPath);
    await this.coverImageInput.evaluate(input =>
      input.dispatchEvent(new Event('change', { bubbles: true }))
    );
    await this.page.waitForLoadState('networkidle');
    console.log('Cover image uploaded:', bannerPath);
  }

  async uploadProfilePicture() {
    await this.handleMaybeLaterIfPresent();
    const profilePath = getProfileImagePath();

    await this.profilePictureEditButton.waitFor({ state: 'visible' });
    await this.profilePictureInput.waitFor({ state: 'attached' });
    await this.profilePictureInput.setInputFiles(profilePath);
    await this.profilePictureInput.evaluate(input =>
      input.dispatchEvent(new Event('change', { bubbles: true }))
    );
    await this.page.waitForLoadState('networkidle');
    console.log('Profile picture uploaded:', profilePath);
  }

  async clearAndTypeUsingKeyboard(locator, value) {
    await locator.waitFor({ state: 'visible' });
    await expect(locator).toBeEnabled();
    await locator.click();
    await locator.press('Control+A');
    await locator.press('Backspace');
    await locator.type(value);
    const typedValue = await locator.inputValue();
    expect(typedValue).toBe(value);
  }

  async fillFullName(name) {
    await this.clearAndTypeUsingKeyboard(this.fullNameTextbox, name);
    await expect(this.fullNameTextbox).toHaveValue(name);
    console.log('Full name updated:', name);
  }

  async fillProfessionalTitle(title) {
    await this.clearAndTypeUsingKeyboard(this.professionalTitleTextbox, title);
    await expect(this.professionalTitleTextbox).toHaveValue(title);
    console.log('Professional title updated:', title);
  }

  async clickSaveChanges() {
    await this.saveChangesButton.waitFor({ state: 'visible' });
    await expect(this.saveChangesButton).toBeVisible();
    await this.saveChangesButton.click();
    await this.page.waitForTimeout(240000);
    console.log('Changes saved');
  }
}
