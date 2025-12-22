export class ArchiveChatPage {
  constructor(page) {
    this.page = page;
    this.messagesButton = page.locator('span').filter({ hasText: 'Messages' }).first();
    this.ChatBox = page.locator("//body/div[@id='root']/div[contains(@class,'min-h-screen bg-gray-50')]/main[contains(@class,'h-screen pt-16')]/div[contains(@class,'w-full h-full overflow-hidden flex flex-col bg-gray-100')]/div[contains(@class,'flex-1 overflow-hidden flex min-h-0')]/div[contains(@class,'w-full md:w-80 lg:w-96 flex flex-col overflow-hidden bg-white border-r border-gray-300')]/div[contains(@class,'flex-1 overflow-y-auto')]/div/div[2]");
    this.archiveButton = page.locator("//div[contains(@class,'flex-1 hidden md:flex flex-col overflow-hidden bg-gray-50')]//button[contains(@title,'Archive')]//*[name()='svg']//*[name()='path' and contains(@fill,'currentCol')]");
    this.unArchiveButton = page.locator('xpath=//*[@id="root"]/div[2]/main/div/div/div[2]/div/div[1]/div[2]/button/svg/path');
  }

  async openMessages() {
    await this.messagesButton.click();

  }
  async openChat() {
    await this.ChatBox.waitFor({ state: 'visible' });
    await this.ChatBox.click();
    
  }
    async archiveChat() {
    await this.archiveButton.waitFor({ state: 'visible' });
    await this.archiveButton.click();
  }
    async unArchiveChat() {
    await this.unArchiveButton.waitFor({ state: 'visible' });
    await this.unArchiveButton.click();
  }


}