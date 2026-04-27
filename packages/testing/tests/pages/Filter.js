import { BasePage } from './base.page.js';
import {expect} from '@playwright/test';
export class FilterPage extends BasePage {
  constructor(page) {
    super(page);

    this.filtersButton = page.getByTestId('navbar-filters-button');
    this.jobTypeSelect = page.getByTestId('job-filter-jobType-select');
    this.workTypeSelect = page.getByTestId('job-filter-workType-select');
    this.experienceLevelSelect = page.getByTestId('job-filter-experienceLevel-select');
    this.regionSelect = page.getByTestId('job-filter-region-select');
    this.currencySelect = page.getByTestId('job-filter-currency-select');
    this.applyFiltersButton = page.getByTestId('job-filter-apply-button');
    this.removeFiltersButton = page.getByTestId('job-filter-remove-all-button');
}

  
  async openFilters() {
    await this.filtersButton.waitFor({ state: 'visible' });
    await this.filtersButton.click();
    console.log('Filters opened');
  }

  async applyFilters() {
    await this.applyFiltersButton.waitFor({ state: 'visible' });
    await this.applyFiltersButton.click();
    console.log('Filters applied');
  }

  // ======================
  // Individual filters
  // ======================

  async applyJobTypeFilter() {
    await this.openFilters();
    await this.jobTypeSelect.waitFor({ state: 'visible' });
    await this.jobTypeSelect.selectOption({ label: 'Full-time' });
    await this.applyFilters();
    console.log('Job type filter applied');
  }

  async applyWorkTypeFilter() {
    await this.openFilters();
    await this.workTypeSelect.waitFor({ state: 'visible' });
    await this.workTypeSelect.selectOption({ label: 'Remote' });
      await this.applyFilters();
    console.log('Work type filter applied');
  }

  async applyExperienceLevelFilter() {
    await this.openFilters();
    await this.experienceLevelSelect.waitFor({ state: 'visible' });
    await this.experienceLevelSelect.selectOption({ label: 'Executive' });
    await this.applyFilters();
    console.log('Experience level filter applied');
  }

  async applyRegionFilter() {
    await this.openFilters();
    await this.regionSelect.waitFor({ state: 'visible' });
    await this.regionSelect.selectOption({ label: 'Australia' });
    await this.applyFilters();
    console.log('Region filter applied');
  }

  async applyCurrencyFilter() {
    await this.openFilters();
    await this.currencySelect.waitFor({ state: 'visible' });
    await this.currencySelect.selectOption({ label: 'USD' });
    await this.applyFilters();
    console.log('Currency filter applied');
  }

}

export default FilterPage;

