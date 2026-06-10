import { BasePage } from './base.page.js';
import {expect} from '@playwright/test';
export class SendMessagePage extends BasePage {
  constructor(page) {
    super(page);

    this.messageButton = page.getByTestId('application-chat-button-recruiter');
    this.messageInput = page.getByTestId('chat-message-input').first();
    this.sendButton = page.getByTestId('chat-send-button');
    this.viewApplicationButton = page.getByTestId('view-applications-button');
    this.viewDetailsButton = page.locator('[data-testid^="application-card-view-details-"]').first();
    
}
  async clickViewApplications() {
    await this.viewApplicationButton.waitFor({ state: 'visible' });
    await this.viewApplicationButton.click();
    console.log('Applications opened');
}
  async clickViewDetails() {
    await this.viewDetailsButton.waitFor({ state: 'visible' });
    await this.viewDetailsButton.click();
    console.log('Candidate details opened');
}


  async clickMessageButton() {
    await this.messageButton.waitFor({ state: 'visible' });
    await this.messageButton.click();
    console.log('Message selected');
  }

  async sendMessage(message) {
    await this.messageInput.waitFor({ state: 'visible' });
    await this.messageInput.fill(message);
     await this.messageInput.press('Enter');
     await this.page.waitForTimeout(3000);
     console.log('Message sent', message);
  }

  
}
