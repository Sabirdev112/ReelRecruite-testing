import {expect} from '@playwright/test';
export class SendMessagePage {
  constructor(page) {
    this.page = page;

    this.messagesButton = page.getByRole('button', { name: 'Messages' });
    this.messageLocator = page.locator('xpath=//*[@id="root"]/div[2]/main/div/div/div[1]/div[3]/div/div[3]/div[2]/div[1]/div');
    this.messageInput = page.locator('xpath=//*[@id="root"]/div[2]/main/div/div/div[2]/div/div[3]/div/form/div/input');
    this.sendButton = page.locator('xpath=//*[@id="root"]/div[2]/main/div/div/div[3]/div/div[3]/div/form/button[2]/svg');
    this.maybeLaterButton = page.getByRole('button', { name: 'Maybe Later' });
  }

  async handleMaybeLaterIfPresent() {
        try {
            await this.maybeLaterButton.waitFor({
                state: 'visible',
                timeout: 2500
            });
            await this.maybeLaterButton.click();
            await this.maybeLaterButton.waitFor({ state: 'hidden' });
        } catch {
            
        }
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