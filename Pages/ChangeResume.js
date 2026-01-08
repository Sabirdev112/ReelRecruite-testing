import { getResumePath } from '../support/resume.helper.js';
import { expect } from '@playwright/test';

export class UploadResume {
  constructor(page) {
    this.page = page;

    this.profileMenu = page.locator('//*[@id="root"]/div[2]/header/div/div[2]/div[2]/div[1]/div/div[1]/div');
    this.ProfileButton = page.getByText('Profile', { exact: true });

    this.resumeSection = page.getByRole('heading', { name: 'Resume', exact: true });

    this.deleteResumeButton = page.getByRole('button', { name: 'Remove Resume' });
    this.confirmDeleteButton = page.getByRole('button', { name: 'Ok' });

    this.maybeLaterButton = page.getByRole('button', { name: 'Maybe Later' });

    this.uploadInput = page.locator('#resume-upload');
  }

  async handleMaybeLaterIfPresent() {
    if (await this.maybeLaterButton.isVisible()) {
      await expect(this.maybeLaterButton).toBeVisible();
      await this.maybeLaterButton.click();
      await expect(this.maybeLaterButton).toBeHidden();
      console.log('Handled Maybe Later modal');
    }
  }

  async clickProfileMenu() {
    await expect(this.profileMenu).toBeVisible();
    await this.profileMenu.click();
    await this.handleMaybeLaterIfPresent();
    console.log('Profile menu clicked');
  }

  async goToProfile() {
    await expect(this.ProfileButton).toBeVisible();
    await this.ProfileButton.click();
    await this.handleMaybeLaterIfPresent();
    await this.page.waitForLoadState('networkidle');
    console.log('Navigated to Profile page');
  }

  async navigateToResumeSection() {
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
      await expect(this.deleteResumeButton).toBeVisible();
      await this.deleteResumeButton.click();
      await this.handleMaybeLaterIfPresent();
      await this.confirmDelete();
      console.log('Existing resume deleted');
    }
  }

  async confirmDelete() {
    if (await this.confirmDeleteButton.isVisible()) {
      await expect(this.confirmDeleteButton).toBeVisible();
      await this.confirmDeleteButton.click();
      await this.page.waitForLoadState('networkidle');
      console.log('Confirmed resume deletion');
    }
  }

  async uploadNewResume(filename = 'Bold-Poster.pdf') {
  await this.handleMaybeLaterIfPresent();

  const resumePath = getResumePath(filename);
  await this.uploadInput.waitFor({ state: 'attached' });

  await Promise.all([
    this.page.waitForResponse(
      r =>
        r.request().method() === 'POST' &&
        r.status() === 200,
      { timeout: 20_0000 }
    ),
    this.uploadInput.setInputFiles(resumePath)
  ]);

  await this.handleMaybeLaterIfPresent();

  console.log(`Resume upload completed: ${resumePath}`);
}

}
