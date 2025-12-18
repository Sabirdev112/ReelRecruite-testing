export class EditJobPage {
    constructor(page) {
        this.page = page;
        this.summaryInput = page.getByRole('textbox', { name: 'Brief summary that attracts' });
        this.editButton = page.getByRole('button', { name: 'Edit' });
        this.customFields = page.getByText('Custom Fields', { exact: true });
        this.saveChangesButton = page.getByRole('button', { name: 'Update Job' });

    }
    async editJob(){
        await this.editButton.waitFor({ state: 'visible' });
        await this.editButton.click();
    }
   async updateDetails() {
  await this.summaryInput.waitFor({ state: 'visible' });

  const randomText = `Edited summary ${Math.random()
    .toString(36)
    .substring(2, 10)}`;

  await this.summaryInput.fill(randomText);
}

    async clickCustomFields(){
        await this.customFields.waitFor({ state: 'visible' });
        await this.customFields.click();
    }
    async saveChanges(){
        await this.saveChangesButton.waitFor({ state: 'visible' });
        await this.saveChangesButton.click();
        await this.page.waitForLoadState('networkidle');
    }

}