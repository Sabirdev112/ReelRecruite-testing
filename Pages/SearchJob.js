import {expect} from '@playwright/test';
export class SearchJob {
  constructor(page) {
    this.page = page;

    this.searchInput = page.getByRole('textbox', { name: 'Search jobs' });
    this.resultsContainer = page.locator('div.max-w-7xl.mx-auto.px-4.sm\\:px-6.lg\\:px-8.py-6');
    this.jobTitles = this.resultsContainer.locator('h3');
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
  
  async searchJob(keyword) {
    if (typeof keyword !== 'string') {
      throw new Error(`searchJob expects a string, received: ${typeof keyword}`);
    }

    await this.searchInput.waitFor({ state: 'visible' });
    await this.searchInput.fill('');
    await this.searchInput.fill(keyword);
    await this.page.waitForTimeout(1500);
    console.log('Keyword entered'); 
  }

  // ==========================
  // Verifications
  // ==========================
  async verifyResultsContain(keyword) {
    const titlesCount = await this.jobTitles.count();
    if (titlesCount === 0) return false;

    for (let i = 0; i < titlesCount; i++) {
      const titleText = (await this.jobTitles.nth(i).innerText()).toLowerCase();
      if (!titleText.includes(keyword.toLowerCase())) {
        return false;
      }
    }
    console.log('Results contain keyword');
    return true;
  }
}

export default SearchJob;
