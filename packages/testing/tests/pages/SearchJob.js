import { BasePage } from './base.page.js';
import {expect} from '@playwright/test';
export class SearchJob extends BasePage {
  constructor(page) {
    super(page);

    this.searchInput = page.getByTestId('navbar-job-search-input');
}

  
  async searchJob(keyword){
    await this.searchInput.waitFor({ state: 'visible' });
    await this.searchInput.fill(keyword);
    await this.searchInput.press('Enter');
    await this.page.waitForTimeout(2000);
    console.log('Job searched');
  }
}

