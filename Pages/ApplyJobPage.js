export class ApplyJobPage {
  constructor(page) {
    this.page = page;
    this.applyNowButton = page.getByRole('button', { name: 'Apply Now' });
    this.recordVideoButton = page.getByRole('button', { name: 'Record Video' });
    this.startRecordingButton = page.getByRole('button', { name: 'Start Recording' });
    this.stopRecordingButton = page.getByRole('button', { name: 'Stop Recording' });
    this.confirmVideoButton = page.getByRole('button', { name: 'Use This Video' });
    this.submitButton = page.getByRole('button', { name: 'Submit Application' });
    
  }

  async applyNow() {
    await this.applyNowButton.click();
  }

  async recordVideo() {
    await this.recordVideoButton.click();
    await this.startRecordingButton.click();
    await this.stopRecordingButton.click();
    await this.confirmVideoButton.click();
  }

  async submitApplication() {
    await this.submitButton.click();
  }
  
}
