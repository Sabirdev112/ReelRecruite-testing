export class UpdateCoverVideoResumePage {
  constructor(page) {
    this.page = page;

   
    this.profileMenu = page.locator('//*[@id="root"]/div[2]/header/div/div[2]/div[2]/div[1]/div/div[1]/div');
    this.profileButton = page.getByText('Profile', { exact: true });
    this.coverVideoSection = page.getByRole('heading', { name: 'Video Resume' });
    this.removeVideoButton = page.getByRole('button', { name: 'Remove Video Resume' });
    this.okButton = page.getByRole('button', { name: 'Ok' });
    this.maybeLaterButton = page.getByRole('button', { name: 'Maybe Later' });

    this.uploadVideoInput = page.locator('label:has-text("Upload Video")');


    this.videoPreview = this.page.locator('video');
  }

  async handleMaybeLaterIfPresent() {
    try {
      await this.maybeLaterButton.waitFor({ state: 'visible', timeout: 2000 });
      await this.maybeLaterButton.click();
      await this.maybeLaterButton.waitFor({ state: 'hidden' });
    } catch {}
  }

  async clickProfile() {
    await this.profileMenu.waitFor({ state: 'visible' });
    await this.profileMenu.click();
  }

  async openProfile() {
    await this.profileButton.waitFor({ state: 'visible' });
    await this.profileButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToCoverVideoSection() {
  await this.coverVideoSection.waitFor({state: 'visible'});
  await this.coverVideoSection.scrollIntoViewIfNeeded();
}

  async removeVideoIfExists() {
    await this.handleMaybeLaterIfPresent();

    if (await this.removeVideoButton.first().isVisible().catch(() => false)) {
      await this.removeVideoButton.first().click({ force: true });
      await this.okButton.waitFor({ state: 'visible' });
      await this.okButton.click();
      await this.removeVideoButton.first().waitFor({ state: 'hidden' });
    }
  }

  async uploadVideo(videoPath) {
  await this.handleMaybeLaterIfPresent();

  
  await this.uploadVideoInput.waitFor({ state: 'visible' });
  await this.uploadVideoInput.click();

  await this.uploadVideoInput.waitFor({ state: 'attached' });

  await this.uploadVideoInput.setInputFiles(videoPath);
  await this.uploadVideoInput.evaluate(input =>
    input.dispatchEvent(new Event('change', { bubbles: true }))
  );
}


}
