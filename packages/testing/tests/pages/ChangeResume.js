import { BasePage } from './base.page.js';
import { getResumePath } from '../utils/resume.helper.js';
import { expect } from '@playwright/test';

export class UploadResume extends BasePage {
  constructor(page) {
    super(page);

    this.profileMenu = page.getByTestId('navbar-user-menu-trigger').first();
    this.ProfileButton = page.getByTestId('navbar-user-menu-item-profile').first();
    this.resumeSection = page.getByTestId('resume-header').first();
    this.deleteResumeButton = page.getByTestId('remove-resume-button');
    this.confirmDeleteButton = page.getByTestId('remove-resume-confirm-button');
this.uploadInput = page.getByTestId('upload-resume-label');
  }

  async clickProfileMenu() {
    await this.profileMenu.waitFor({ state: 'visible' });
    await expect(this.profileMenu).toBeVisible();
    await this.profileMenu.click();
    console.log('Profile menu clicked');
  }

  async goToProfile() {
    await this.ProfileButton.waitFor({ state: 'visible' });
    await expect(this.ProfileButton).toBeVisible();
    await this.ProfileButton.click();
console.log('Navigated to Profile page');
  }

  async navigateToResumeSection() {
    await this.resumeSection.waitFor({ state: 'visible' });
    await expect(this.resumeSection).toBeVisible();
    await this.resumeSection.scrollIntoViewIfNeeded();
    console.log('Scrolled to Resume section');
  }

  async deleteExistingResume() {
    if (await this.uploadInput.isVisible()) {
      console.log('No existing resume to delete');
      return;
    }

    if (await this.deleteResumeButton.isVisible()) {
      await this.deleteResumeButton.waitFor({ state: 'visible' });
      await expect(this.deleteResumeButton).toBeVisible();
      await this.deleteResumeButton.click();
console.log('Existing resume deleted');
    }
  }

  async confirmDelete() {
    if (await this.confirmDeleteButton.isVisible()) {
      await this.confirmDeleteButton.waitFor({ state: 'visible' });
      await this.confirmDeleteButton.click();
console.log('Confirmed resume deletion');
    }
  }

  async uploadNewResume(filename = 'Bold-Poster.pdf') {
const resumePath = getResumePath(filename);
  await this.uploadInput.waitFor({ state: 'attached' });

  const uploadPromise = this.page.waitForResponse(
    res =>
      res.url().includes('/upload') && // ✅ make this specific
      res.request().method() === 'POST' &&
      res.status() === 200,
    { timeout: 60000 }
  );

  await this.uploadInput.setInputFiles(resumePath);
  await uploadPromise;

  await expect(this.uploadInput).toBeEnabled();
  console.log(`Resume upload completed: ${resumePath}`);
}

}


