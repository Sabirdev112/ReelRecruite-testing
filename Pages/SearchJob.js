// Pages/SearchJob.js
export class SearchJob {
  constructor(page) {
    this.page = page;

    // Search input
    this.searchInput = page.getByRole('textbox', { name: 'Search jobs' });

    // Job results container
    this.resultsContainer = page.locator(
      'div.max-w-7xl.mx-auto.px-4.sm\\:px-6.lg\\:px-8.py-6'
    );

    // Individual job titles
    this.jobTitles = this.resultsContainer.locator('h3');
  }

  // ==========================
  // Actions
  // ==========================
  async searchJob(keyword) {
    if (typeof keyword !== 'string') {
      throw new Error(`searchJob expects a string, received: ${typeof keyword}`);
    }

    await this.searchInput.waitFor({ state: 'visible' });
    await this.searchInput.fill('');
    await this.searchInput.fill(keyword);
    await this.page.waitForTimeout(1500); // debounce / API wait
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
    return true;
  }
}

export default SearchJob;
