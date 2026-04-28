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
    await this.page.locator('input[type="file"]').first().waitFor({ state: 'attached' });
    await this.page.locator('input[type="file"]').first().setInputFiles(bannerPath);
    await this.page.locator('input[type="file"]').first().evaluate(input =>
      input.dispatchEvent(new Event('change', { bubbles: true }))
    );
    console.log('Cover image uploaded:', bannerPath);
  }

  async uploadProfilePicture() {
const profilePath = getProfileImagePath();
    await this.profilePictureEditButton.waitFor({ state: 'visible' });
    await this.page.locator('input[type="file"]').last().waitFor({ state: 'attached' });
    await this.page.locator('input[type="file"]').last().setInputFiles(profilePath);
    await this.page.locator('input[type="file"]').last().evaluate(input =>
      input.dispatchEvent(new Event('change', { bubbles: true }))
    );
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
    await this.saveChangesButton.click();

    console.log('Changes saved');
  }
}


