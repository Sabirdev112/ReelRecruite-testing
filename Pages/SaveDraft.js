export class SaveDraft {
  constructor(page) {
    this.page = page;
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.postNewJobButton = page.getByRole('button', { name: 'Post New Job' });
    this.titleInput = page.getByRole('textbox', { name: 'e.g., Senior React Developer' });
    this.summaryInput = page.getByRole('textbox', { name: 'Brief summary that attracts' });
    this.regionInput = page.getByRole('textbox', { name: 'e.g., North America, Europe,' });
    this.saveDraftButton = page.getByRole('button', { name: 'Save Draft' });
    this.draftSavedMessage = page.getByText('Draft saved successfully');
  }
   async Cancel() {
    await this.cancelButton.click();
  }

   async clickIfVisible(locator) {
  if (await locator.isVisible().catch(() => false)) {
    await locator.click();
    return true;
  }
  return false;
}

async postJob () {
    await this.clickIfVisible(this.cancelButton);
    await this.postNewJobButton.waitFor({ state: 'visible'});
    await this.postNewJobButton.click();
  }
async fillBasicInfo() {
    await this.titleInput.fill('Software Quality Assurance Engineer');
    await this.summaryInput.fill('We are looking for a detail-oriented Software Quality Assurance Engineer to join our dynamic team. The ideal candidate will have experience in manual and automated testing, a keen eye for detail, and a passion for ensuring software quality.');
    await this.regionInput.fill('North America');
  }

    async saveDraft() {
    await this.saveDraftButton.waitFor({ state: 'visible'});
    await this.saveDraftButton.click();
  }

}