import { BasePage } from './base.page.js';
export class withdrawPage extends BasePage {
    constructor(page) {
        super(page);
        this.withdrawButton = page.getByRole('button', { name: 'Withdraw Application' })
        this.confirmWithdrawButton = page.getByRole('button', { name: 'Ok' });
    }

    async withdraw () {
        await this.withdrawButton.waitFor({ state: 'visible' });
        await this.withdrawButton.click();
        console.log('Withdraw button clicked');
    }

    async confirmWithdraw () {
        await this.confirmWithdrawButton.waitFor({ state: 'visible' });
        await this.confirmWithdrawButton.click();
        console.log('Confirm withdraw button clicked');
    }

}
