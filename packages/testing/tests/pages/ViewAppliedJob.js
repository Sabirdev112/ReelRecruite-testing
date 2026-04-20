import { BasePage } from './base.page.js';
import {expect} from '@playwright/test';
export class viewAppliedJobPage extends BasePage {
        constructor(page) {
            super(page);
            this.viewAppliedJobsButton = page.getByTestId('navbar-nav-item-applications');
}
        async clickViewAppliedJobs() {  
            await this.viewAppliedJobsButton.click();
            console.log('Navigated to View Applied Jobs page');
        }
}
