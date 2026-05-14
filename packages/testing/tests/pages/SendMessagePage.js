import { BasePage } from './base.page.js';
import {expect} from '@playwright/test';
export class SendMessagePage extends BasePage {
  constructor(page) {
    super(page);

    this.messageLocator = page.getByTestId('chat-item-5ebf38d4-6aed-4b5e-b68b-4067040e03e7');
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


  async selectMessage() {
    await this.messageLocator.waitFor({ state: 'visible' });
    await this.messageLocator.click();
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
