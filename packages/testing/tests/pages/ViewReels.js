import { BasePage } from './base.page.js';
export class ViewReelsPage extends BasePage {
    constructor(page) {
        super(page);
        this.viewReelsButton = page.getByTestId('view-reels-button');
    }

    async navigateToViewReels() {
        await this.viewReelsButton.waitFor({ state: 'visible' });
        await this.viewReelsButton.click();
        console.log('Navigated to View Reels page');
    }

}

