import fs from 'fs';
import path from 'path';

export class UpdateCoverVideoResumePage {
  constructor(page) {
    this.page = page;

    // =======================
    // Profile Navigation
    // =======================
    this.profileMenu = page.locator(
      '//*[@id="root"]/div[2]/header/div/div[2]/div[2]/div[1]/div/div[1]/div'
    );
    this.profileButton = page.getByText('Profile', { exact: true });

    // =======================
    // Cover Video Locators
    // =======================
    this.removeVideoButton = page.getByRole('button', { name: 'Remove Video Resume' });
    this.okButton = page.getByRole('button', { name: 'Ok' });
    this.maybeLaterButton = page.getByRole('button', { name: 'Maybe Later' });

    // Upload input (hidden)
    this.uploadVideoInput = page.locator('#video-resume-upload');

    // =======================
    // Record Video Locators
    // =======================
    this.recordVideoButton = page.getByRole('button', { name: 'Record Video' });
    this.startRecordingButton = page.getByRole('button', { name: 'Start Recording' });
    this.stopRecordingButton = page.getByRole('button', { name: 'Stop Recording' });
    this.pauseRecordingButton = page.getByRole('button', { name: 'Pause' });
    this.useThisVideoButton = page.getByRole('button', { name: 'Use This Video' });
  }

  // =======================
  // Profile Navigation
  // =======================
  async clickProfile() {
    await this.profileMenu.waitFor({ state: 'visible' });
    await this.profileMenu.click();
  }

  async openProfile() {
    await this.profileButton.waitFor({ state: 'visible' });
    await this.profileButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  // =======================
  // Remove Video & Maybe Later
  // =======================
  
 async clickIfVisible(locator) {
  if (await locator.isVisible().catch(() => false)) {
    await locator.click();
    return true;
  }
  return false;
}

  async handleMaybeLaterPopup() {
    await this.maybeLaterButton.click();
  }
  async removeVideo() {
    await this.clickIfVisible(this.maybeLaterButton);
    if ((await this.removeVideoButton.count()) > 0) {
      await this.removeVideoButton.first().click({ force: true });
      await this.okButton.waitFor({ state: 'visible' });
      await this.okButton.click({ force: true });
      await this.page.waitForLoadState('networkidle'); // ensure DOM updates
    }
  }


  // =======================
  // Upload Video Resume
  // =======================
  async uploadVideo(filePath) {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
      throw new Error(`File does not exist: ${fullPath}`);
    }

    // Scroll into view (if hidden) and upload
    await this.uploadVideoInput.scrollIntoViewIfNeeded();
    await this.uploadVideoInput.setInputFiles(fullPath, { force: true });

    // Wait until Remove button appears to confirm upload
    await this.removeVideoButton.first().waitFor({ state: 'visible' });
    // await this.page.waitForLoadState('networkidle'); // ensure DOM updates
  }

  // =======================
  // Record Video Resume
  // =======================
async recordVideo() {
    await this.recordVideoButton.waitFor({ state: 'visible' });
    await this.recordVideoButton.click();
  }

async startRecording () {
  await this.startRecordingButton.waitFor({ state: 'visible' });
  await this.startRecordingButton.click();
  await this.page.waitForTimeout(10000); 
}

async stopRecording () {
  await this.stopRecordingButton.waitFor({ state: 'visible' });
  await this.stopRecordingButton.click();
}

async useVideo () {
  await this.useThisVideoButton.waitFor({ state: 'visible' });
  await this.useThisVideoButton.click();
}


}
