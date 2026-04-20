import { BasePage } from './base.page.js';
export class EditJobPage extends BasePage {
    constructor(page) {
        super(page);
        this.summaryInput = page.getByTestId('job-highlight-textarea');
        this.editButton = page.getByTestId('job-edit-button');
        this.customFields = page.getByTestId('edit-job-tab-label-custom');
        this.saveChangesButton = page.getByTestId('update-job-button');
}

    async editJob(){
        await this.editButton.waitFor({ state: 'visible' });
        await this.editButton.click();
        console.log('clicked on edit job button');
    }

     async clearAndTypeUsingKeyboard(locator, value) {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
    await locator.press('Control+A');
    await locator.press('Backspace');
    await locator.type(value);
  }

   async updateDetails() {
       await this.clearAndTypeUsingKeyboard(this.summaryInput, 'Updated job summary for testing purposes.');
       console.log('Job details updated.');
    }

    async clickCustomFields(){
        await this.customFields.waitFor({ state: 'visible' });
        await this.customFields.click();
        console.log('clicked on custom fields');
    }
    async saveChanges(){
        await this.saveChangesButton.waitFor({ state: 'visible' });
        await this.saveChangesButton.click();
        console.log('Changes saved.');
    }

}
