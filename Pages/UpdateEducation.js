import { expect } from '@playwright/test';

export class UpdateEducationPage {
  constructor(page) {
    this.page = page;

    this.profileMenu = page.locator('//*[@id="root"]/div[2]/header/div/div[2]/div[2]/div[1]/div/div[1]/div');
    this.ProfileButton = page.getByText('Profile', { exact: true });

    this.educationSection = page.getByRole('heading', { name: 'Education' });
    this.deleteEduButton = page.locator('xpath=//*[@id="root"]/div[2]/main/div/div/div[3]/div[3]/div[2]/div/div/div[2]/div[1]/div[2]/div/button[2]');
    this.confirmDeleteButton = page.getByRole('button', { name: 'Ok' });
    this.addEducationButton = page.locator('xpath=//*[@id="root"]/div[2]/main/div/div/div[3]/div[3]/div[2]/button');

    this.schoolTextbox = page.getByRole('textbox', { name: /e\.g\., Harvard University/i });
    this.degreeTextbox = page.getByRole('textbox', { name: /e\.g\., Bachelor of Science/i });
    this.fieldOfStudyTextbox = page.getByRole('textbox', { name: 'e.g., Computer Science' });
    this.gpaTextbox = page.getByRole('textbox', { name: /e\.g\., 3\.8 GPA/i });
    this.locationTextbox = page.getByRole('textbox', { name: /e\.g\., Cambridge, MA/i });
    this.startDateInput = page.getByRole('textbox', { name: /Start Date \*/i });
    this.endDateTextbox = page.getByLabel('I am currently studying here');
    this.descriptionTextbox = page.getByRole('textbox', { name: /Describe your studies, achievements, activities\.\.\./i });

    this.saveChangesButton = page.locator('xpath=//*[@id="root"]/div[2]/main/div/div/div[4]/div/form/div[2]/button[1]');
    this.maybeLaterButton = page.getByRole('button', { name: 'Maybe Later' });
  }

  async handleMaybeLaterIfPresent() {
    try {
      await this.maybeLaterButton.waitFor({ state: 'visible', timeout: 2000 });
      await expect(this.maybeLaterButton).toBeVisible();
      await this.maybeLaterButton.click();
      await expect(this.maybeLaterButton).toBeHidden();
      console.log('Handled "Maybe Later" modal');
    } catch {}
  }

  async clearAndTypeUsingKeyboard(locator, value) {
    await locator.waitFor({ state: 'visible' });
    await expect(locator).toBeEnabled();
    await locator.click();
    await locator.press('Control+A');
    await locator.press('Backspace');
    await locator.type(value);
    const typedValue = await locator.inputValue();
    expect(typedValue).toBe(value);
    console.log(`Typed value: "${value}"`);
  }

  async selectDropdownByLabel(dropdown, label) {
    await dropdown.waitFor({ state: 'visible' });
    await expect(dropdown).toBeEnabled();
    await dropdown.selectOption({ label });
    console.log(`Dropdown selected: "${label}"`);
  }

  async clickProfile() {
    await this.profileMenu.waitFor({ state: 'visible', timeout: 10000 });
    await expect(this.profileMenu).toBeVisible();
    await this.profileMenu.click();
    console.log('Clicked profile menu');
  }

  async openProfile() {
    await this.ProfileButton.waitFor({ state: 'visible' });
    await expect(this.ProfileButton).toBeVisible();
    await this.ProfileButton.click();
    await this.page.waitForLoadState('networkidle');
    console.log('Opened profile');
  }

  async navigateToEducation() {
    await this.educationSection.scrollIntoViewIfNeeded();
    await expect(this.educationSection).toBeVisible();
    console.log('Navigated to Education section');
  }

  async deleteEducation() {
    await this.deleteEduButton.waitFor({ state: 'visible' });
    await expect(this.deleteEduButton).toBeVisible();
    await this.deleteEduButton.click();
    console.log('Clicked delete education');
  }

  async confirmDelete() {
    await this.confirmDeleteButton.waitFor({ state: 'visible' });
    await expect(this.confirmDeleteButton).toBeVisible();
    await this.confirmDeleteButton.click();
    console.log('Confirmed delete');
  }

  async deleteIfVisibleAndProceed() {
    const isDeleteVisible = await this.deleteEduButton.isVisible().catch(() => false);
    if (isDeleteVisible) {
      await this.deleteEduButton.click({ force: true });
      await expect(this.confirmDeleteButton).toBeVisible();
      await this.confirmDeleteButton.click();
      await this.page.reload({ waitUntil: 'networkidle' });
      await this.handleMaybeLaterIfPresent();
      console.log('Deleted existing education entry');
    } else {
      console.log('No education entry to delete');
    }
  }

  async clickAddEducation() {
    await this.addEducationButton.waitFor({ state: 'visible' });
    await expect(this.addEducationButton).toBeVisible();
    await this.addEducationButton.click();
    console.log('Clicked "Add Education" button');
  }

  async updateSchool(school) {
    await this.clearAndTypeUsingKeyboard(this.schoolTextbox, school);
    console.log(`Updated school: ${school}`);
  }

  async updateDegree(degree) {
    await this.clearAndTypeUsingKeyboard(this.degreeTextbox, degree);
    console.log(`Updated degree: ${degree}`);
  }

  async updateFieldOfStudy(fieldOfStudy) {
    await this.clearAndTypeUsingKeyboard(this.fieldOfStudyTextbox, fieldOfStudy);
    console.log(`Updated field of study: ${fieldOfStudy}`);
  }

  async updateGPA(gpa) {
    await this.clearAndTypeUsingKeyboard(this.gpaTextbox, gpa);
    console.log(`Updated GPA: ${gpa}`);
  }

  async updateLocation(location) {
    await this.clearAndTypeUsingKeyboard(this.locationTextbox, location);
    console.log(`Updated location: ${location}`);
  }

  async updateStartDate(startDate) {
    await this.startDateInput.waitFor({ state: 'visible' });
    await this.startDateInput.fill(startDate);
    const value = await this.startDateInput.inputValue();
    expect(value).toBe(startDate);
    console.log(`Updated start date: ${startDate}`);
  }

  async updateEndDate() {
    await this.endDateTextbox.waitFor({ state: 'visible' });
    await this.endDateTextbox.check();
    expect(await this.endDateTextbox.isChecked()).toBe(true);
    console.log('Checked "I am currently studying here"');
  }

  async updateDescription(description) {
    await this.clearAndTypeUsingKeyboard(this.descriptionTextbox, description);
    console.log(`Updated description: ${description}`);
  }

  async saveChanges() {
    await this.saveChangesButton.waitFor({ state: 'visible' });
    await expect(this.saveChangesButton).toBeVisible();
    await this.saveChangesButton.click();
    await this.page.waitForLoadState('networkidle');
    console.log('Saved education changes');
  }
}
