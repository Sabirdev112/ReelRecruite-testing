export class SeeResumePage {
  constructor(page) {
    this.page = page;

    this.viewApplicationButton = page.getByRole('button', { name: 'View All Applications' });
    this.viewDetailsButton = page.locator('button', { hasText: 'View Details' }).first();
    this.viewProfileButton = page.getByRole('button', { name: 'View Profile' });
    this.ResumeSection = page.getByText('Resume', { exact: true });
    this.clickViewResumeButton = page.locator("body > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > svg:nth-child(3)");
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
  async navigateToResumeSection() {
    await this.ResumeSection.waitFor({ state: 'visible' });
    await this.ResumeSection.scrollIntoViewIfNeeded();
  }
  async clickViewResume() {
    await this.clickViewResumeButton.waitFor({ state: 'visible' });
    await this.clickViewResumeButton.click();
    await this.page.waitForTimeout(5000);
  }

 

}
