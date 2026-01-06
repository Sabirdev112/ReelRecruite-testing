import { expect } from '@playwright/test';

export class ArchiveChatPage {
  constructor(page) {
    this.page = page;
    this.messagesButton = page.locator('span').filter({ hasText: 'Messages' }).first();
    this.ChatBox = page.locator(
      "//body/div[@id='root']/div[contains(@class,'min-h-screen bg-gray-50')]/main[contains(@class,'h-screen pt-16')]/div[contains(@class,'w-full h-full overflow-hidden flex flex-col bg-gray-100')]/div[contains(@class,'flex-1 overflow-hidden flex min-h-0')]/div[contains(@class,'w-full md:w-80 lg:w-96 flex flex-col overflow-hidden bg-white border-r border-gray-300')]/div[contains(@class,'flex-1 overflow-y-auto')]/div/div[2]"
    );
    this.archiveButton = page.locator(
      "//div[contains(@class,'flex-1 hidden md:flex flex-col overflow-hidden bg-gray-50')]//button[contains(@title,'Archive')]//*[name()='svg']//*[name()='path' and contains(@fill,'currentCol')]"
    );
    this.unArchiveButton = page.locator(
      "//div[@class='flex-1 hidden md:flex flex-col overflow-hidden bg-gray-50']//button[@title='Unarchive']//*[name()='svg']//*[name()='path' and contains(@fill,'currentCol')]"
    );
    this.maybeLaterButton = page.getByRole('button', { name: 'Maybe Later' });
  }

  // Handles optional "Maybe Later" modal
  async handleMaybeLaterIfPresent() {
    if (await this.maybeLaterButton.isVisible()) {
      await expect(this.maybeLaterButton).toBeVisible();
      await this.maybeLaterButton.click();
      await expect(this.maybeLaterButton).toBeHidden();
    }
  }

  // Open messages sidebar
  async openMessages() {
    await expect(this.messagesButton).toBeVisible();
    await this.messagesButton.click();
    await expect(this.messagesButton).toBeEnabled();
    console.log('Messages opened.');
  }

  // Open specific chat
  async openChat() {
    await expect(this.ChatBox).toBeVisible();
    await this.ChatBox.click();
    await expect(this.ChatBox).toBeVisible(); 
    console.log('Chat opened.');
  }

  // Archive chat
  async archiveChat() {
    await expect(this.archiveButton).toBeVisible();
    await this.archiveButton.click();
    await expect(this.archiveButton).toBeHidden();
    await expect(this.unArchiveButton).toBeVisible();
    console.log('Chat archived.');
  }

  // Unarchive chat
  async unArchiveChat() {
    await expect(this.unArchiveButton).toBeVisible();
    await this.unArchiveButton.click();
    await expect(this.unArchiveButton).toBeHidden();
    await expect(this.archiveButton).toBeVisible();
    console.log('Chat unarchived.');
  }
}
