import { BasePage } from './base.page.js';

export class ArchiveChatPage extends BasePage {
  constructor(page) {
    super(page);
    this.viewApplicationButton = page.getByTestId('view-applications-button');
    this.viewDetailsButton = page.locator('[data-testid^="application-card-view-details-"]').first();
    this.messagesButton = page.getByTestId('application-chat-button-recruiter');
    this.archiveButton = page.getByTestId('chat-archive-button').first();
    this.unArchiveButton = page.getByTestId('chat-realunarchive-button').first();
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
async clickMessagesButton() {
    await this.messagesButton.waitFor({ state: 'visible' });
    await this.messagesButton.click();
    console.log('Messages opened');
}

  // Archive chat
  async archiveChat() {
    await this.archiveButton.waitFor({ state: 'visible' });
    await this.archiveButton.click();
    await this.archiveButton.waitFor({ state: 'hidden' });
    console.log('Chat archived.');
  }

  // Unarchive chat
  async unArchiveChat() {
    await this.unArchiveButton.waitFor({ state: 'visible' });
    await this.unArchiveButton.click();
    await this.archiveButton.waitFor({ state: 'visible' });
    console.log('Chat unarchived.');
  }
}
