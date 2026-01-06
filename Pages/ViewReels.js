export class ViewReelsPage {
    constructor(page) {
        this.page = page;
        this.viewReelsButton = page.getByRole('button', { name: 'View Reels' });
        this.scrollLocator = page.locator('div.fixed.right-4.top-1\\/2.-translate-y-1\\/2.hidden.md\\:flex.flex-col.gap-4.z-30');
    }

    async navigateToViewReels() {
        await this.viewReelsButton.waitFor({ state: 'visible' });
        await this.viewReelsButton.click();
        console.log('Navigated to View Reels page');
    }

    async scrollToReel(locator) {
        await locator.scrollIntoViewIfNeeded();
        console.log('Scrolling reels');
    }
}
