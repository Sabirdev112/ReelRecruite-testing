// Pages/UpdateWork.js

export class UpdateWorkPage {
  constructor(page) {
    this.page = page;

    /* =======================
       Profile Navigation
    ======================= */
    this.profileMenu = page.locator(
      '//*[@id="root"]/div[2]/header/div/div[2]/div[2]/div[1]/div/div[1]/div'
    );
    this.profileButton = page.getByText('Profile', { exact: true });

    /* =======================
       Work Experience Buttons
    ======================= */
    this.editWorkButton = page.locator(
      "div[class='min-h-screen bg-gray-50'] div:nth-child(2) div:nth-child(2) div:nth-child(1) div:nth-child(1) div:nth-child(2) div:nth-child(1) div:nth-child(2) div:nth-child(1) button:nth-child(1)"
    );
    
    this.addWorkExperienceButton = page.locator(
      "button[title='Add Work Experience']"
    );

    /* =======================
       Form Fields
    ======================= */
    this.companyInput = page.getByRole('textbox', { name: 'e.g., Google' });
    this.jobTitleInput = page.getByRole('textbox', {
      name: /Senior Software Engineer/i,
    });

    this.employmentTypeDropdown = page.locator('#employment-type-0');
    this.locationTypeDropdown = page.locator('#location-type-0');

    this.startDateInput = page.getByRole('textbox', { name: 'Start Date *' });
    this.endDateInput = page.getByRole('textbox', { name: 'End Date' });
    this.presentCheckbox = page.getByRole('checkbox');

    this.descriptionInput = page.getByRole('textbox', {
      name: /Describe your responsibilities/i,
    });

    this.achievementInput = page.getByRole('textbox', {
      name: /add achievement/i,
    });

    this.skillInput = page.getByRole('textbox', {
      name: /add skill/i,
    });

    /* =======================
       Action Buttons
    ======================= */
    this.saveButton = page.getByRole('button', { name: /Save Changes/i });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  /* =======================
     Helpers
  ======================= */
  async selectDropdownByLabel(dropdown, label) {
    await dropdown.waitFor({ state: 'visible' });
    await dropdown.selectOption({ label });
  }
  

  async clearAndFill(input, value) {
    await input.waitFor({ state: 'visible' });
    await input.fill('');
    await input.fill(value);
  }

  /* =======================
     Navigation
  ======================= */
  async openProfile() {
    await this.profileMenu.click();
    await this.profileButton.click();
    await this.page.waitForLoadState('networkidle');
  }
  async openEditWorkForm() {
    await this.editWorkButton.waitFor({
      state: 'visible',
      timeout: 10000,
    });
  
    await this.editWorkButton.scrollIntoViewIfNeeded();
    await this.editWorkButton.click();
  
    await this.companyInput.waitFor({
      state: 'visible',
      timeout: 10000,
    });
  }
  

  async openAddWorkForm() {
    await this.addWorkExperienceButton.waitFor({ state: 'visible' });
    await this.addWorkExperienceButton.click();
    await this.companyInput.waitFor({ state: 'visible' });
  }

  /* =======================
     Form Actions
  ======================= */
  async fillCompany(name) {
    await this.clearAndFill(this.companyInput, name);
  }

  async fillJobTitle(title) {
    await this.clearAndFill(this.jobTitleInput, title);
  }

  async selectEmploymentType(type) {
    await this.selectDropdownByLabel(
      this.employmentTypeDropdown,
      type
    );
  }
  

  async selectLocationType(type) {
    await this.selectDropdownByLabel(
      this.locationTypeDropdown,
      type
    );
  }
  

  async fillStartDate(date) {
    await this.clearAndFill(this.startDateInput, date);
  }

  async fillEndDate(date) {
    await this.clearAndFill(this.endDateInput, date);
  }

  async setPresent(isPresent) {
    if (isPresent) {
      await this.presentCheckbox.check();
    } else {
      await this.presentCheckbox.uncheck();
    }
  }

  async fillDescription(text) {
    await this.clearAndFill(this.descriptionInput, text);
  }

  async addTags(input, values) {
    const items = Array.isArray(values) ? values : [values];
    for (const value of items) {
      await input.fill(value);
      await input.press('Enter');
    }
  }

  async saveChanges() {
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /* =======================
     Full Flows
  ======================= */
  async updateWork(data) {
    await this.openEditWorkForm();
    await this.fillForm(data);
    await this.saveChanges();
  }

  async addNewWorkExperience(data) {
    await this.openAddWorkForm();
    await this.fillForm(data);
    await this.saveChanges();
  }

  async fillForm({
    company,
    jobTitle,
    employmentType,
    locationType,
    startDate,
    endDate,
    isPresent,
    description,
    achievements,
    skills,
  }) {
    if (company) await this.fillCompany(company);
    if (jobTitle) await this.fillJobTitle(jobTitle);
    if (employmentType) await this.selectEmploymentType(employmentType);
    if (locationType) await this.selectLocationType(locationType);
    if (startDate) await this.fillStartDate(startDate);

    if (isPresent) {
      await this.setPresent(true);
    } else if (endDate) {
      await this.fillEndDate(endDate);
    }

    if (description) await this.fillDescription(description);
    if (achievements) await this.addTags(this.achievementInput, achievements);
    if (skills) await this.addTags(this.skillInput, skills);
  }
}

export default UpdateWorkPage;
