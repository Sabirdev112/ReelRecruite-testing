import {expect} from '@playwright/test';
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

  async applyNow() {
    await this.applyNowButton.waitFor({ state: 'visible' });
    await this.applyNowButton.click();
  }

  async recordVideo() {
    await this.recordVideoButton.click();
    await this.startRecordingButton.click();
    console.log('Video recording started.');
  }

  async stopRecording() {
    await this.stopRecordingButton.click();
    await this.confirmVideoButton.waitFor({ state: 'attached' });
    await this.page.waitForFunction(
    (selector) => {
      const btn = document.querySelector(selector);
      return btn && !btn.disabled;
    },
    {},
    'button:has-text("Use This Video")'
  );
    await this.confirmVideoButton.waitFor({ state: 'detached' });
    await this.confirmVideoButton.click();
    await this.page.waitForLoadState('networkidle');
    console.log('Video recording stopped.');
  }

  async answerOne() {
    const answer =
        'I have 5 years of experience in software testing, specializing in automation and performance testing. I am proficient in tools like Selenium, JIRA, and Postman. I have worked in Agile environments and have a strong understanding of SDLC.';

    await this.firstQuestion.fill(answer);
    await expect(this.firstQuestion).toHaveValue(answer);
    console.log('Answer 1 filled.');
}


  async answerTwo (){
    await this.secondQuestion.check();
    console.log('Answer 2 checked.');
  }
  async submitApplication() {
    await this.submitButton.waitFor({ state: 'visible' });
    await this.submitButton.click();
    await this.page.waitForLoadState('networkidle');
    console.log('Application submitted.');
  }
  
}
