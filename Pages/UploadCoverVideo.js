import {getVideoPath} from '../support/resume.helper.js';
export class UpdateCoverVideoResumePage {
  constructor(page) {
    this.page = page;

   
    this.profileMenu = page.getByTestId('navbar-user-menu-trigger').first();
    this.profileButton = page.getByTestId('navbar-user-menu-item-profile').first();
    this.coverVideoSection = page.getByTestId('video-resume-header');
    this.removeVideoButton = page.getByRole('button', { name: 'Remove Video Resume' }).last();
    this.okButton = page.getByRole('button', { name: 'Ok' });
    this.maybeLaterButton = page.getByRole('button', { name: 'Maybe Later' });
    this.uploadVideoInput = page.getByTestId('upload-video-label');
  }

  async handleMaybeLaterIfPresent() {
    try {
      await this.maybeLaterButton.waitFor({ state: 'visible', timeout: 2000 });
      await this.maybeLaterButton.click();
      await this.maybeLaterButton.waitFor({ state: 'hidden', timeout: 2000 });
    } catch {}
  }

  async clickProfile() {
    await this.profileMenu.waitFor({ state: 'visible' });
    await this.profileMenu.click();
    console.log('Profile button clicked');
  }

  async openProfile() {
    await this.profileButton.waitFor({ state: 'visible' });
    await this.profileButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    console.log('Navigated to Profile page');
  }

  async navigateToCoverVideoSection() {
  await this.coverVideoSection.waitFor({state: 'visible'});
  await this.coverVideoSection.scrollIntoViewIfNeeded();
  console.log('Cover video section opened');
}

 async removeVideoIfExists() {
    await this.handleMaybeLaterIfPresent();

    if (await this.uploadVideoInput.isVisible()) {
          console.log('No existing video to delete - upload button is visible');
          return;
        }
    
        if (await this.removeVideoButton.isVisible()) {
          await this.removeVideoButton.waitFor({ state: 'visible' });
          await this.removeVideoButton.click();
          await this.handleMaybeLaterIfPresent();

          console.log('Video removed successfully');
}
 }


async uploadVideo(filename = 'small-video.mp4') {
    await this.handleMaybeLaterIfPresent();

    const videoPath = getVideoPath(filename);

    console.log(`Starting video upload: ${filename}`);

    // Locate the file input that specifically handles video
    const videoInput = this.page.locator('input[type="file"][accept*="video"]');
    
    // Fallback if the accept attribute is missing
    let targetInput = videoInput;
    if (await videoInput.count() === 0) {
        console.log('No input with accept="video" found, trying fallback...');
        targetInput = this.page.locator('input[type="file"]').last();
    }

    await targetInput.waitFor({ state: 'attached', timeout: 10000 });
    console.log('Video input element is attached to DOM');

    await targetInput.setInputFiles(videoPath);
    console.log(`Successfully set file: ${videoPath}. Waiting for upload to complete...`);
    try {
        await this.removeVideoButton.waitFor({ state: 'visible', timeout: 60000 });
        console.log('Upload completed: Remove Video button is now visible');
    } catch (e) {
        console.log('Timed out waiting for Remove Video button. Check if upload is still in progress.');
        const statusText = await this.uploadVideoInput.innerText();
        console.log(`Current status text: ${statusText}`);
    }
    console.log('Waiting for "Remove Video Resume" button to appear...');
    for (let i = 0; i < 12; i++) { // Wait up to 60s (12 * 5s)
        const isVisible = await this.removeVideoButton.isVisible();
        if (isVisible) {
            console.log('Upload completed! "Remove Video Resume" button is visible.');
            break;
        }
        const text = await this.page.getByTestId('video-resume-header').locator('..').innerText();
        console.log(`[${i*5}s] Current UI text: ${text.replace(/\n/g, ' ')}`);
    }

    console.log('Video upload function finished');
}






}
