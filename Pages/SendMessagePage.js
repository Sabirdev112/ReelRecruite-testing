export class SendMessagePage {
  constructor(page) {
    this.page = page;

    // Locators for the message functionality
    this.messagesButton = page.getByRole('button', { name: 'Messages' });
    this.messageLocator = page.locator('xpath=//*[@id="root"]/div[2]/main/div/div/div[1]/div[3]/div/div[3]/div[2]/div[1]/div');
    this.messageInput = page.locator('xpath=//*[@id="root"]/div[2]/main/div/div/div[2]/div/div[3]/div/form/div/input');
    
    // Updated send button selector
    this.sendButton = page.locator('xpath=//*[@id="root"]/div[2]/main/div/div/div[3]/div/div[3]/div/form/button[2]/svg');
  }

  async openMessages() {
    await this.messagesButton.waitFor({ state: 'visible'});
    await this.messagesButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectMessage() {
    await this.messageLocator.waitFor({ state: 'visible' });
    await this.messageLocator.click();
  }

  async sendMessage(message) {
    await this.messageInput.waitFor({ state: 'visible' });
    await this.messageInput.fill(message);
     await this.messageInput.press('Enter');
     await this.page.waitForTimeout(3000);
  }

  
}