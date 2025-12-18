export class SeeCoverVideoPage {
  constructor(page) {
    this.page = page;

    this.viewApplicationButton = page.getByRole('button', { name: 'View All Applications' });
    this.viewDetailsButton = page.locator('button', { hasText: 'View Details' }).first();
    this.viewProfileButton = page.getByRole('button', { name: 'View Profile' });
    this.coverVideoSection = page.locator('h2:text("Video Resume")');
    this.video = page.locator('video');
  }
  async navigateToApplications() {
    await this.viewApplicationButton.waitFor({ state: 'visible' });
    await this.viewApplicationButton.click();
  }
    async viewCandidateDetails() {  
    await this.viewDetailsButton.waitFor({ state: 'visible' });
    await this.viewDetailsButton.click();
  }
    async viewCandidateProfile() {  
    await this.viewProfileButton.waitFor({ state: 'visible' });
    await this.viewProfileButton.click();
  }

 async navigateToCoverVideoSection() {
    await this.coverVideoSection.waitFor({ state: 'visible' });
    await this.coverVideoSection.scrollIntoViewIfNeeded();
    
  }

  async playVideo() {
    await this.video.waitFor({ state: 'visible' });

    const videoHandle = await this.video.elementHandle();

    await this.page.evaluate(video => {
      video.muted = true; // required to bypass autoplay restrictions
      video.play();
    }, videoHandle);
  }

  async isVideoPlaying() {
    const videoHandle = await this.video.elementHandle();

    return await this.page.evaluate(video => {
      return !video.paused && video.currentTime > 0;
    }, videoHandle);
  }
}
