import fs from 'fs';
import path from 'path';

export class CreateJobPage {
  constructor(page) {
    this.page = page;
    this.createdJobId = null;

    // Main buttons
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
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

    // Preview / Post
    this.previewButton = page.locator('button.bg-primary:has-text("Preview")');
    this.seeAllButton = page.getByRole('button', { name: 'See All' });
  }

  /* ------------------ Helpers ------------------ */

  async captureAndStoreJobId() {
  this.page.on('response', async (response) => {
    if (
      response.request().method() === 'POST' &&
      response.url().includes('/v1/jobs/create')
    ) {
      const body = await response.json();

      // ✅ CORRECT PATH
      this.createdJobId = body?.job?.id;

      if (!this.createdJobId) return;

      const filePath = path.join(
        process.cwd(),
        'fixtures/recruiter/jobid.json'
      );

      fs.mkdirSync(path.dirname(filePath), { recursive: true });

      fs.writeFileSync(
        filePath,
        JSON.stringify(
          {
            jobId: this.createdJobId,
            recruiterId: body.job.recruiterId,
            companyId: body.job.companyId,
            createdAt: body.job.createdAt
          },
          null,
          2
        )
      );
    }
  });
}


  /* ------------------ Flow Methods ------------------ */

  async Cancel() {
    await this.cancelButton.click();
  }
  async clickIfVisible(locator) {
  if (await locator.isVisible().catch(() => false)) {
    await locator.click();
    return true;
  }
  return false;
}


  async openJobForm() {
  // Click Cancel if it appears immediately after login
  await this.clickIfVisible(this.cancelButton);

  // Continue to Post New Job
  await this.postNewJobButton.waitFor({ state: 'visible', timeout: 10000 });
  await this.postNewJobButton.click();
  await this.titleInput.waitFor({ state: 'visible', timeout: 10000 });
}

  async fillJobDetails() {
    await this.titleInput.fill('Software Quality Assurance Engineer');
    await this.summaryInput.fill(
      'We need a Software QA Engineer skilled in Playwright and automation testing.'
    );
    await this.regionInput.fill('South America');
    await this.locationInput.fill('Pakistan');
    await this.nextButton.click();
  }

  async fillJobTypeAndCompensation({
    jobType = 'Internship',
    workType = 'On-site',
    experience = 'Executive',
    salaryRange = '50000-70000',
    currency = 'pkr (₨)',
    expirationDate = '2025-12-30'
  } = {}) {
    await this.page.waitForSelector('.react-select__input-container', { timeout: 10000 });

    const inputContainers = this.page.locator('.react-select__input-container');
    const controls = this.page.locator('.react-select__control');

    await inputContainers.first().click();
    await this.page.getByRole('option', { name: jobType }).click();

    await controls.nth(1).locator('.react-select__input-container').click();
    await this.page.getByRole('option', { name: workType }).click();

    await controls.nth(2).locator('.react-select__input-container').click();
    await this.page.getByRole('option', { name: experience }).click();

    await this.salaryInput.fill(salaryRange);
    await this.currencySelectControl.click();
    await this.page.getByRole('option', { name: currency }).click();

    await this.expirationDateInput.fill(expirationDate);
    await this.nextButton.click();
  }

  async fillJobDescription() {
    await this.descriptionBox.fill(
      'Responsible for testing web applications and automating tests using Playwright.'
    );
    await this.nextButton.click();
  }

  async addSkills() {
    const skills = ['Playwright', 'Postman', 'JMeter'];
    for (const skill of skills) {
      await this.skillInput.fill(skill);
      await this.skillInput.press('Enter');
    }
  }

  async fillRequirements() {
    await this.educationInput.fill('BSCS');
    await this.educationInput.press('Enter');
    await this.cultureInput.fill('SQA');
    await this.cultureInput.press('Enter');
    await this.nextButton.click();
  }

  async addQuestions() {
    await this.addQuestionButton.click();
    await this.questionBox.fill('How many years of experience do you have?');
    await this.requiredCheckbox.check();

    await this.addQuestionButton.click();
    await this.questionBox.fill('Are you a CS graduate?');
    await this.responseType.selectOption('boolean');
  }

  async previewJob() {
    await this.previewButton.click();
  }

async submitJob() {
  await this.createJobButton.waitFor({ state: 'visible', timeout: 10000 });

  // Wait for the job creation API response while clicking the button
  const response = await Promise.all([
    this.page.waitForResponse(
      (res) =>
        res.request().method() === 'POST' &&
        res.url().includes('/v1/jobs/create'),
      { timeout: 15000 } // adjust if needed
    ),
    this.createJobButton.click()
  ]);

  const responseBody = await response[0].json();

  // Extract jobId from response
  this.createdJobId = responseBody?.job?.id;

  if (!this.createdJobId) {
    throw new Error(
      `Job ID not found in response: ${JSON.stringify(responseBody)}`
    );
  }

  // Store jobId in JSON file
  const filePath = path.join(
    process.cwd(),
    'fixtures/recruiter/jobid.json'
  );

  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  fs.writeFileSync(
    filePath,
    JSON.stringify(
      {
        jobId: this.createdJobId,
        recruiterId: responseBody.job.recruiterId,
        companyId: responseBody.job.companyId,
        createdAt: responseBody.job.createdAt
      },
      null,
      2
    )
  );

  return this.createdJobId;
}




  async seeAllApplications() {
    await this.seeAllButton.click();
  }
}
