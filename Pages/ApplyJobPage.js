export class ApplyJobPage {
  constructor(page) {
    this.page = page;
    this.applyNowButton = page.getByRole('button', { name: 'Apply Now' });
    this.recordVideoButton = page.getByRole('button', { name: 'Record Video' });
    this.startRecordingButton = page.getByRole('button', { name: 'Start Recording' });
    this.stopRecordingButton = page.getByRole('button', { name: 'Stop Recording' });
    this.confirmVideoButton = page.getByRole('button', { name: 'Use This Video' });
    this.submitButton = page.getByRole('button', { name: 'Submit Application' });
    this.firstQuestion = page.getByRole('textbox')
    this.secondQuestion = page.getByLabel('Yes');
    
  }

  async applyNow() {
    await this.applyNowButton.waitFor({ state: 'visible' });
    await this.applyNowButton.click();
  }

  async recordVideo() {
    await this.recordVideoButton.click();
    await this.startRecordingButton.click();
  }

  async stopRecording() {
    await this.stopRecordingButton.click();
    await this.confirmVideoButton.waitFor({ state: 'visible' });
    await this.confirmVideoButton.click();
  }

  async answerOne (){
    await this.firstQuestion.fill('I have 5 years of experience in software testing, specializing in automation and performance testing. I am proficient in tools like Selenium, JIRA, and Postman. I have worked in Agile environments and have a strong understanding of SDLC.');
  }

  async answerTwo (){
    await this.secondQuestion.check();
  }
  async submitApplication() {
    await this.submitButton.waitFor({ state: 'visible' });
    await this.submitButton.click();
  }
  
}
