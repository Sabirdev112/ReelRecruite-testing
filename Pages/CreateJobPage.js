export class CreateJobPage {
  constructor(page) {
    this.page = page;

    // Main buttons
    this.postNewJobButton = page.getByRole('button', { name: 'Post New Job' });
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.createJobButton = page.getByRole('button', { name: 'Confirm & publish job' });

    // Job details section
    this.titleInput = page.getByRole('textbox', { name: 'e.g., Senior React Developer' });
    this.summaryInput = page.getByRole('textbox', { name: 'Brief summary that attracts' });
    this.regionInput = page.getByRole('textbox', { name: 'e.g., North America, Europe,' });
    this.locationInput = page.getByRole('textbox', { name: 'e.g., San Francisco, CA' });

    // Salary & Currency
    this.salaryInput = page.getByRole('textbox', { name: 'e.g., $80,000 - $' });
    this.currencySelectControl = page.locator('.w-32 > div > .react-select-container > .react-select__control');

    // Date Selection
    this.expirationDateInput = page.getByPlaceholder('Select expiration date');

    // Description
    this.descriptionBox = page.locator('.ql-editor');

    // Skills
    this.skillInput = page.getByRole('textbox', { name: 'e.g., React, TypeScript' });

    // Requirements
    this.educationInput = page.getByRole('textbox', { name: "e.g., Bachelor's degree in CS" });
    this.cultureInput = page.getByRole('textbox', { name: 'e.g., startup, fast-growing' });

    // Questions
    this.addQuestionButton = page.getByRole('button', { name: 'Add Question' });
    this.questionBox = page.getByRole('textbox', { name: 'e.g., Why are you interested' });
    this.requiredCheckbox = page.getByRole('checkbox', { name: 'This question is required' });
    this.responseType = page.getByRole('combobox');
    // preview - target the primary Preview button specifically to avoid strict-mode collisions
    this.previewButton = page.locator('button.bg-primary:has-text("Preview")');
  }

  // Open the form after login
  async openJobForm() {
    
    await this.postNewJobButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.postNewJobButton.click();
    await this.titleInput.waitFor({ state: 'visible', timeout: 10000 });
  }

  // Step 1: Job Details
  async fillJobDetails() {
    await this.titleInput.fill('Software Quality Assurance Engineer');
    await this.summaryInput.fill('We need a Software QA Engineer skilled in Playwright and automation testing.');
    await this.regionInput.fill('South America');
    await this.locationInput.fill('Pakistan');
    await this.nextButton.click();
  }

  // Step 2: Job Type, Work Type, Experience, Salary, Currency, Expiration Date
  async fillJobTypeAndCompensation({
    jobType = 'Internship',
    workType = 'On-site',
    experience = 'Executive',
    salaryRange = '50000-70000',
    currency = 'pkr (₨)',
    expirationDate = '2025-11-30'
  } = {}) {
    // Wait for Job Type section
    await this.page.waitForSelector('.react-select__input-container', { state: 'visible', timeout: 10000 });

    // Define locators AFTER wait
    const reactSelectInputContainers = this.page.locator('.react-select__input-container');
    const reactSelectControls = this.page.locator('.react-select__control');

    // Job Type
    await reactSelectInputContainers.first().click();
    await this.page.getByRole('option', { name: jobType }).waitFor({ state: 'visible', timeout: 5000 });
    await this.page.getByRole('option', { name: jobType }).click();

    // Work Type
    await reactSelectControls.nth(1).locator('.react-select__value-container > .react-select__input-container').click();
    await this.page.getByRole('option', { name: workType }).waitFor({ state: 'visible', timeout: 5000 });
    await this.page.getByRole('option', { name: workType }).click();

    // Experience
    await reactSelectControls.nth(2).locator('.react-select__value-container > .react-select__input-container').click();
    await this.page.getByRole('option', { name: experience }).waitFor({ state: 'visible', timeout: 5000 });
    await this.page.getByRole('option', { name: experience }).click();

    // Salary & Currency
    await this.salaryInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.salaryInput.fill(salaryRange);
    await this.currencySelectControl.click();
    await this.page.getByRole('option', { name: currency }).waitFor({ state: 'visible', timeout: 15000 });
    await this.page.getByRole('option', { name: currency }).click();

    // Expiration Date
    await this.expirationDateInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.expirationDateInput.fill(expirationDate);

    // Next → Description Section
    await this.nextButton.click();
    await this.page.waitForSelector('.ql-editor', { state: 'visible', timeout: 15000 });
  }

  // Step 3: Description
  async fillJobDescription() {
    await this.descriptionBox.waitFor({ state: 'visible', timeout: 15000 });
    await this.descriptionBox.fill('Responsible for testing web applications, writing test cases, and automating tests using Playwright.');
    await this.nextButton.click();
  }

  // Step 4: Skills
  async addSkills() {
    await this.skillInput.waitFor({ state: 'visible', timeout: 15000 });
    const skills = ['Playwright', 'Postman', 'JMeter'];
    for (const skill of skills) {
      await this.skillInput.fill(skill);
      await this.skillInput.press('Enter');
    }
    
  }

  // Step 5: Requirements
  async fillRequirements() {
    await this.educationInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.educationInput.fill('BSCS');
    await this.educationInput.press('Enter');
    await this.cultureInput.fill('SQA');
    await this.cultureInput.press('Enter');
    await this.nextButton.click();
  }

  // Step 6: Questions
  async addQuestions() {
    await this.addQuestionButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.addQuestionButton.click();

    await this.questionBox.fill('Do you have the skills mentioned?');
    await this.requiredCheckbox.check();

    await this.addQuestionButton.click();
    await this.questionBox.fill('Are you a CS graduate?');
    await this.responseType.selectOption('boolean');

    await this.addQuestionButton.click();
    await this.questionBox.fill('Are you a boy?');
    await this.responseType.selectOption('video');
  }
async previewJob() {
    await this.previewButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.previewButton.click();
    // Wait for a preview panel/modal to appear (best-effort)
    await this.page.waitForSelector('div[role="dialog"], .modal, text=Preview', { state: 'visible', timeout: 10000 }).catch(() => {});
}
  // Step 7: Submit Job
  async submitJob() {
    await this.createJobButton.waitFor({ state: 'visible', timeout: 10000 });
    await Promise.all([
      
      this.createJobButton.click()
    ]);
  }
}
