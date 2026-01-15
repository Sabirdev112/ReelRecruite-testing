import { expect } from '@playwright/test';
import { storeJobId } from '../support/job.helper.js';

export class CreateJobPage {
  constructor(page) {
    this.page = page;
    this.createdJobId = null;

    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.postNewJobButton = page.getByRole('button', { name: 'Post New Job' });
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.createJobButton = page.getByRole('button', { name: 'Confirm & publish job' });

    this.titleInput = page.getByRole('textbox', { name: 'e.g., Senior React Developer' });
    this.summaryInput = page.getByRole('textbox', { name: 'Brief summary that attracts' });
    this.regionInput = page.getByRole('textbox', { name: 'e.g., North America, Europe,' });
    this.locationInput = page.getByRole('textbox', { name: 'e.g., San Francisco, CA' });

    this.salaryInput = page.getByRole('textbox', { name: 'e.g., $80,000 - $' });
    this.currencySelectControl = page.locator('.w-32 > div > .react-select-container > .react-select__control');

    this.expirationDateInput = page.getByPlaceholder('Select expiration date');
    this.descriptionBox = page.locator('.ql-editor');

    this.skillInput = page.getByRole('textbox', { name: 'e.g., React, TypeScript' });

    this.educationInput = page.getByRole('textbox', { name: "e.g., Bachelor's degree in CS" });
    this.cultureInput = page.getByRole('textbox', { name: 'e.g., startup, fast-growing' });

    this.addQuestionButton = page.getByRole('button', { name: 'Add Question' });
    this.questionBox = page.getByRole('textbox', { name: 'e.g., Why are you interested' });
    this.requiredCheckbox = page.getByRole('checkbox', { name: 'This question is required' });
    this.responseType = page.getByRole('combobox');

    this.previewButton = page.locator("//button[contains(text(),'Preview')]");
    this.seeAllButton = page.getByRole('button', { name: 'See All' });

    // AI Generation locators
    this.generateWithAIButton = page.getByRole('button', { name: 'Generate with AI' });
    this.generateButton = page.getByText('Generate', { exact: true });
    this.applyButton = page.getByRole('button', { name: 'Apply' });
    this.closeButton = page.locator("//button[@aria-label='Close']//*[name()='svg']");
    this.aiPromptTextarea = page.locator('textarea.w-full.px-4.py-3.border.border-gray-300.rounded-lg.focus\\:ring-2.focus\\:ring-primary.focus\\:border-transparent.resize-none');
  }

  async handleCancelIfPresent() {
    if (await this.cancelButton.isVisible()) {
      await expect(this.cancelButton).toBeVisible();
      await this.cancelButton.click();
      await expect(this.cancelButton).toBeHidden();
    }
    console.log('Handled Cancel if present');
  }

    async openJobForm() {
    await this.handleCancelIfPresent();
    await this.postNewJobButton.waitFor({ state: 'visible' });
    await this.postNewJobButton.click();
    await this.handleCancelIfPresent();
    await this.titleInput.waitFor({ state: 'visible' });
    console.log('Job form opened');
}

  async fillJobDetails() {
    await this.titleInput.fill('Software Quality Assurance Engineer');
    await this.summaryInput.fill('We need a Software QA Engineer skilled in Playwright and automation testing.');
    await this.regionInput.fill('South America');
    await this.locationInput.fill('Pakistan');
    await this.nextButton.click();
    console.log('Job details filled');
  }

  async fillJobTypeAndCompensation({
    jobType = 'Internship',
    workType = 'On-site',
    experience = 'Executive',
    salaryRange = '50000-70000',
    currency = 'pkr (₨)',
    expirationDate
  } = {}) {
    const inputContainers = this.page.locator('.react-select__input-container');
    const controls = this.page.locator('.react-select__control');

    const baseDate = expirationDate ? new Date(expirationDate) : new Date();
    baseDate.setDate(baseDate.getDate() + 2);
    const formattedExpirationDate = baseDate.toISOString().split('T')[0];

    await inputContainers.first().click();
    await this.page.getByRole('option', { name: jobType }).click();

    await controls.nth(1).locator('.react-select__input-container').click();
    await this.page.getByRole('option', { name: workType }).click();

    await controls.nth(2).locator('.react-select__input-container').click();
    await this.page.getByRole('option', { name: experience }).click();

    await this.salaryInput.fill(salaryRange);
    await this.currencySelectControl.click();
    await this.page.getByRole('option', { name: currency }).click();

    await this.expirationDateInput.fill(formattedExpirationDate);
    await this.nextButton.click();
    console.log('Job type and compensation filled');
  }

  async fillJobDescription() {
    await this.descriptionBox.fill('Responsible for testing web applications and automating tests using Playwright.');
    await this.nextButton.click();
    console.log('Job description filled');
  }

  async addSkills() {
    const skills = ['Playwright', 'Postman', 'JMeter'];
    for (const skill of skills) {
      await this.skillInput.fill(skill);
      await this.skillInput.press('Enter');
    }
    console.log('Skills added');
  }

  async fillRequirements() {
    await this.educationInput.fill('BSCS');
    await this.educationInput.press('Enter');
    await this.cultureInput.fill('SQA');
    await this.cultureInput.press('Enter');
    console.log('Requirements filled');
  }

  async addQuestions() {
    await this.addQuestionButton.click();
    await this.questionBox.fill('How many years of experience do you have?');
    await this.requiredCheckbox.check();

    await this.addQuestionButton.click();
    await this.questionBox.fill('Are you a CS graduate?');
    await this.responseType.selectOption('boolean');
    console.log('Questions added');
  }

  async previewJob() {
    await this.previewButton.click();
    console.log('Preview job clicked');
  }

  async submitJob() {
    await expect(this.createJobButton).toBeVisible();
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (res) => res.request().method() === 'POST' && res.url().includes('/v1/jobs/create'),
        { timeout: 15000 }
      ),
      this.createJobButton.click()
    ]);

    const responseBody = await response.json();
    this.createdJobId = responseBody?.job?.id;
    expect(this.createdJobId).toBeTruthy();

    storeJobId(this.createdJobId);
    return this.createdJobId;
  }

  async seeAllApplications() {
    await this.seeAllButton.click();
    console.log('See all applications clicked');
  }

  async generateSummaryWithAI() {
    await this.generateWithAIButton.click();
    console.log('Generate with AI button clicked for summary');
  }

  async applyGeneratedSummary() {
    await this.applyButton.click();
    console.log('Applied generated summary');
  }

  async generateDescriptionWithAI() {
    await this.generateWithAIButton.click();
    console.log('Generate with AI button clicked for description');
  }

  async applyGeneratedDescription() {
    await this.applyButton.click();
    console.log('Applied generated description');
  }

  async closeAIModal() {
    await this.closeButton.click();
    console.log('Closed AI modal');
  }

  async fillAIPrompt(prompt) {
    await this.aiPromptTextarea.fill(prompt);
    console.log(`Filled AI prompt: ${prompt}`);
  }

  async generateWithPrompt(prompt) {
    await this.fillAIPrompt(prompt);
    await Promise.all([
      this.page.waitForLoadState('networkidle', { timeout: 30000 }),
      this.generateButton.click()
    ]);
    console.log('Generated content with AI prompt');
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  }
}
