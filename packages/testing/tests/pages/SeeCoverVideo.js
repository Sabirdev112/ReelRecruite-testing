import { BasePage } from './base.page.js';
import {expect} from '@playwright/test';
export class SeeCoverVideoPage extends BasePage {
  constructor(page) {
    super(page);

    this.viewApplicationButton = page.getByTestId('view-applications-button');
    this.viewDetailsButton = page.locator('[data-testid^="application-card-view-details-"]').first();
    this.viewProfileButton = page.getByTestId('application-view-profile-button');
    this.coverVideoSection = page.getByTestId('video-resume-header');
    this.video = page.getByTestId('video-resume-player');
}
 
  async navigateToApplications() {
    await this.viewApplicationButton.waitFor({ state: 'visible' });
    await this.viewApplicationButton.click();
    console.log('Applications opened');
  }
    async viewCandidateDetails() {  
    await this.viewDetailsButton.waitFor({ state: 'visible' });
    await this.viewDetailsButton.click();
    console.log('Candidate details opened');
  }
    async viewCandidateProfile() {  
    await this.viewProfileButton.waitFor({ state: 'visible' });
    await this.viewProfileButton.click();
    console.log('Candidate profile opened');
  }

 async navigateToCoverVideoSection() {
    await this.coverVideoSection.waitFor({ state: 'visible' });
    await this.coverVideoSection.scrollIntoViewIfNeeded();
    console.log('Cover video section opened');
    
  }

}
