import {expect} from '@playwright/test';
export class viewAppliedJobPage {
        constructor(page) {
            this.page = page;
            this.viewAppliedJobsButton = page.getByText('Applications', { exact: true });
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
        async clickViewAppliedJobs() {  
            await this.viewAppliedJobsButton.click();
        }
}