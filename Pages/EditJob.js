import {expect} from '@playwright/test';
export class EditJobPage {
    constructor(page) {
        this.page = page;
        this.summaryInput = page.getByRole('textbox', { name: 'Brief summary that attracts' });
        this.editButton = page.getByRole('button', { name: 'Edit' });
        this.customFields = page.getByText('Custom Fields', { exact: true });
        this.saveChangesButton = page.getByRole('button', { name: 'Update Job' });
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
            // Modal did not appear — safe to continue
        }
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
        await this.page.waitForLoadState('networkidle');
        console.log('Changes saved.');
    }

}