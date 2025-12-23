export class ShortlistCandidatePage {
  constructor(page) {
    this.page = page;
    this.viewApplicationButton = page.locator('button').filter({ hasText: 'View All Applications' }).first();
    this.viewDetailsButton = page.locator('xpath=//*[@id="root"]/div[2]/main/div/div[2]/div[3]/div[1]/div/div[2]/button/span');
    this.changeStatusButton = page.getByRole('button', { name: 'Update Status' });
    this.shortListedButton = page.getByRole('button', { name: '⭐Shortlisted' });
    this.rejectButton = page.getByRole('button', { name: '❌Rejected' });
    this.saveButton = page.locator('xpath=//*[@id="root"]/div[2]/main/div/div[3]/div/form/div[4]/button[2]');
  }
  async clickViewApplications() {
    await this.viewApplicationButton.waitFor({ state: 'visible' });
    await this.viewApplicationButton.click();
  }
  async clickViewDetails() {
    await this.viewDetailsButton.waitFor({ state: 'visible' });
    await this.viewDetailsButton.click();
  }
  async updateStatus() {
    await this.changeStatusButton.waitFor({ state: 'visible' });
    await this.changeStatusButton.click();
  }
  async clickShortListed() {
    await this.shortListedButton.waitFor({ state: 'visible' });
    await this.shortListedButton.click();
  }
  async clickSave() {
    await this.saveButton.waitFor({ state: 'visible' });
    await this.saveButton.click();
  }
  
  async clickReject() {
    await this.rejectButton.waitFor({ state: 'visible' });
    await this.rejectButton.click();
  }
}