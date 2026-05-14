import { BasePage } from './base.page.js';
import { expect } from '@playwright/test';
import { getBannerImagePath, getProfileImagePath } from '../utils/profileMedia.helper.js';

export class UpdateInfoPage extends BasePage {
  constructor(page) {
    super(page);
    this.profileMenu = page.getByTestId('navbar-user-menu-trigger').first();
    this.profileButton = page.getByTestId('navbar-user-menu-item-profile').first();
    this.editProfileButton = page.getByTestId('edit-profile-info-button');
    this.coverImageButton = page.getByTestId('edit-profile-cover-upload-button');
    this.profilePictureEditButton = page.getByTestId('edit-profile-avatar-upload-button');
    this.fullNameTextbox = page.locator('#fullName');
    this.professionalTitleTextbox = page.locator('#title');
    this.saveChangesButton = page.getByTestId('profile-save-changes-button');
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async openProfileMenu() {
    await this.profileMenu.waitFor({ state: 'visible' });
    await this.profileMenu.click();
    console.log('Profile menu opened');
  }

  async clickProfile() {
    await this.profileButton.waitFor({ state: 'visible' });
    await this.profileButton.click();
    console.log('Navigated to profile page');
  }

  async clickEditProfile() {
    await this.editProfileButton.waitFor({ state: 'visible' });
    await this.editProfileButton.click();
    console.log('Edit profile button clicked');
  }

  async uploadCoverImage() {
    const bannerPath = getBannerImagePath();
    await this.coverImageButton.waitFor({ state: 'visible' });

    // Click the upload button and capture the resulting file picker.
    // This avoids positional locators like input[type=file]:first/last, which
    // are fragile on the candidate page (resume + cover-video inputs are also
    // attached to the DOM and shift the index).
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.coverImageButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(bannerPath);
    console.log('Cover image uploaded:', bannerPath);
  }

  async uploadProfilePicture() {
    const profilePath = getProfileImagePath();
    await this.profilePictureEditButton.waitFor({ state: 'visible' });

    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.profilePictureEditButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(profilePath);
    console.log('Profile picture uploaded:', profilePath);
  }

  async fillFullName(name) {
    await this.fullNameTextbox.waitFor({ state: 'visible' });
    await this.fullNameTextbox.fill(name);
    console.log('Full name updated:', name);
  }

  async fillProfessionalTitle(title) {
    await this.professionalTitleTextbox.waitFor({ state: 'visible' });
    await this.professionalTitleTextbox.fill(title);
    console.log('Professional title updated:', title);
  }

  async clickSaveChanges() {
    await this.saveChangesButton.waitFor({ state: 'visible' });

    const responsePromise = this.page.waitForResponse(
      (response) =>
        response.url().includes('/v1/profile/update') &&
        ['POST', 'PUT', 'PATCH'].includes(response.request().method()),
    );
    await this.saveChangesButton.click();
    const response = await responsePromise;

    if (!response.ok()) {
      const body = await response.text().catch(() => '<no body>');
      throw new Error(
        `Profile update failed: HTTP ${response.status()} ${response.url()} — ${body}`
      );
    }

    await expect(this.editProfileButton).toBeVisible();
    console.log(`Changes saved (HTTP ${response.status()})`);
  }
}


