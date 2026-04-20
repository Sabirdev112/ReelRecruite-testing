import { BasePage } from './base.page.js';
import {expect} from '@playwright/test';
export class SendMessagePage extends BasePage {
  constructor(page) {
    super(page);

    this.messagesButton = page.getByTestId('navbar-nav-item-messages');
    this.messageLocator = page.getByTestId('chat-item-5ebf38d4-6aed-4b5e-b68b-4067040e03e7');
    this.messageInput = page.getByTestId('chat-message-input').first();
    this.sendButton = page.getByTestId('chat-send-button');
}

  async openMessages() {
    await this.messagesButton.waitFor({ state: 'visible'});
    await this.messagesButton.click();
    await this.page.waitForLoadState('networkidle');
    console.log('Messages opened');
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
