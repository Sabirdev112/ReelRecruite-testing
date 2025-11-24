export class SendMessagePage {
  constructor(page) {
    this.page = page;

    // Locators for the message functionality
    this.messagesButton = page.getByRole('button', { name: 'Messages' });
    this.messageLocator = page.getByRole('img', { name: 'Sabir' });
    this.messageInput = page.locator('input.flex-1.bg-transparent.outline-none.text-sm:visible');
    
    // Updated send button selector
    this.sendButton = page.locator('#root > div.min-h-screen.bg-gray-50 > main > div > div > div.flex-1.hidden.md\\:flex.flex-col.overflow-hidden.bg-gray-50 > div > div.flex-shrink-0.px-4.py-3.bg-white.border-t.border-gray-200.z-10 > form > button > svg');
  }

  async openMessages() {
    await this.messagesButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.messagesButton.click(); // Click the Messages button
  }

  async selectMessage() {
    await this.messageLocator.waitFor({ state: 'visible', timeout: 10000 });
    await this.messageLocator.click(); // Click the specific message
  }

  async sendMessage(content) {
    await this.messageInput.fill(content); // Fill the message input
    await this.sendButton.click(); // Click the send button
  }
}