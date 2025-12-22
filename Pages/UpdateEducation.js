// Pages/UpdateEducation.js

export class UpdateEducationPage {
    constructor(page) {
      this.page = page;
  
      // Locators - Profile navigation (same as UpdateAbout)
      this.profileMenu = page.locator('//*[@id="root"]/div[2]/header/div/div[2]/div[2]/div[1]/div/div[1]/div');
      this.ProfileButton = page.getByText('Profile', { exact: true });
      this.deleteEduButton = page.locator('xpath=//*[@id="root"]/div[2]/main/div/div/div[3]/div[3]/div[2]/div/div/div[2]/div[1]/div[2]/div/button[2]/svg/path');
      this.confirmDeleteButton = page.getByRole('button', { name: 'Ok' });
      this.addEducationButton = page.getByText('Add Education', { exact: true });
  
      // Education form fields
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
      await this.maybeLaterButton.click();
      await this.maybeLaterButton.waitFor({ state: 'hidden' });
    } catch {}
  }

    async clickProfile() {
      await this.profileMenu.waitFor({ state: 'visible', timeout: 10000 });
      await this.profileMenu.click();
    }
  
    async openProfile() {
      await this.ProfileButton.waitFor({ state: 'visible' });
      await this.ProfileButton.click();
      await this.page.waitForLoadState('networkidle');
    }
  async deleteEducation() {
    await this.deleteEduButton.waitFor({ state: 'visible' });
    await this.deleteEduButton.click();
  }
  async confirmDelete() {
    await this.confirmDeleteButton.waitFor({ state: 'visible' });
    await this.confirmDeleteButton.click();
  }
    async deleteIfVisibleAndProceed() {
  const isDeleteVisible = await this.deleteEduButton.isVisible().catch(() => false);

  if (isDeleteVisible) {
    await this.deleteEduButton.click();
    await this.confirmDeleteButton.waitFor({ state: 'visible' });
    await this.confirmDeleteButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  // If delete is not visible, it will silently continue
}


    async clickAddEducation() {
      await this.addEducationButton.waitFor({ state: 'visible' });
      await this.addEducationButton.click();
    }

    async clearAndTypeUsingKeyboard(locator, value) {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
    await locator.press('Control+A');
    await locator.press('Backspace');
    await locator.type(value);
  }

  async updateSchool(school) {
    await this.clearAndTypeUsingKeyboard(this.schoolTextbox, school);
  }

  async updateDegree(degree) {
    await this.clearAndTypeUsingKeyboard(this.degreeTextbox, degree); 
  }

  async updateFieldOfStudy(fieldOfStudy) {
    await this.clearAndTypeUsingKeyboard(this.fieldOfStudyTextbox, fieldOfStudy);
  }

  async updateGPA(gpa) {
    await this.clearAndTypeUsingKeyboard(this.gpaTextbox, gpa);
  }

  async updateLocation(location) {
    await this.clearAndTypeUsingKeyboard(this.locationTextbox, location);
  }

  async updateStartDate(startDate) {
    await this.startDateInput.waitFor({ state: 'visible' });
    await this.startDateInput.fill(startDate);
  }

  async updateEndDate(){
    await this.endDateTextbox.waitFor({ state: 'visible' });
    await this.endDateTextbox.check();
  }

  async updateDescription(description) {
    await this.clearAndTypeUsingKeyboard(this.descriptionTextbox, description);
  }

  async saveChanges() {
    await this.saveChangesButton.waitFor({ state: 'visible' });
    await this.saveChangesButton.click();
    await this.page.waitForLoadState('networkidle');
  }
  

  }