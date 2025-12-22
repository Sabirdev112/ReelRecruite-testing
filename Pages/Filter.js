// Pages/Filter.js
export class FilterPage {
  constructor(page) {
    this.page = page;

    // Open Filters modal
    this.filtersButton = this.filtersButton = page.getByRole('button', { name: 'Filters' });

    // Job Type
    this.jobTypeSelect = page.locator(
      '//*[@id="root"]/div[2]/div[2]/div/div[2]/section[1]/div[2]/div[1]/select'
    );

    // Work Type
    this.workTypeSelect = page.locator(
      'body > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > section:nth-child(1) > div:nth-child(2) > div:nth-child(2) > select:nth-child(2)'
    );

    // Experience Level
    this.experienceLevelSelect = page.locator('//div[3]//select[1]');

    // Region
    this.regionSelect = page.locator(
      "//div[@class='relative bg-white rounded-lg shadow-lg mx-auto animate-in fade-in-0 zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto w-full max-w-3xl p-0']//div[1]//div[1]//select[1]"
    );

    // Currency
    this.currencySelect = page.locator(
      "//div[@class='relative bg-white rounded-lg shadow-lg mx-auto animate-in fade-in-0 zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto w-full max-w-3xl p-0']//div[1]//div[2]//select[1]"
    );

    // Buttons
    this.applyFiltersButton = page.getByRole('button', { name: 'Apply filters' });
    this.removeFiltersButton = page.getByRole('button', { name: 'Remove filters' });
  }

  // ======================
  // Common helpers
  // ======================



  
  async openFilters() {
    await this.filtersButton.waitFor({ state: 'visible' });
    await this.filtersButton.click();
  }

  async selectRandomOption(selectLocator) {
    await selectLocator.waitFor({ state: 'visible' });

    const options = await selectLocator.locator('option').all();
    if (options.length <= 1) return;

    // Skip "All" option
    const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;
    const value = await options[randomIndex].getAttribute('value');

    await selectLocator.selectOption(value);
  }

  async applyFilters() {
    await this.applyFiltersButton.waitFor({ state: 'visible' });
    await this.applyFiltersButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  // ======================
  // Individual filters
  // ======================

  async applyJobTypeFilter() {
    await this.openFilters();
    await this.selectRandomOption(this.jobTypeSelect);
    await this.applyFilters();
  }

  async applyWorkTypeFilter() {
    await this.openFilters();
    await this.selectRandomOption(this.workTypeSelect);
    await this.applyFilters();
  }

  async applyExperienceLevelFilter() {
    await this.openFilters();
    await this.selectRandomOption(this.experienceLevelSelect);
    await this.applyFilters();
  }

  async applyRegionFilter() {
    await this.openFilters();
    await this.selectRandomOption(this.regionSelect);
    await this.applyFilters();
  }

  async applyCurrencyFilter() {
    await this.openFilters();
    await this.selectRandomOption(this.currencySelect);
    await this.applyFilters();
  }

  async applyAllFilters() {
    await this.openFilters();
    await this.selectRandomOption(this.jobTypeSelect);
    await this.selectRandomOption(this.workTypeSelect);
    await this.selectRandomOption(this.experienceLevelSelect);
    await this.selectRandomOption(this.regionSelect);
    await this.selectRandomOption(this.currencySelect);
    await this.applyFilters();
  }
}

export default FilterPage;
