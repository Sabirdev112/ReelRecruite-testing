export class viewAppliedJobPage {
        constructor(page) {
            this.page = page;
            this.viewAppliedJobsButton = page.getByText('Applications', { exact: true });
        }
        async clickViewAppliedJobs() {  
            await this.viewAppliedJobsButton.click();
        }
}