// Pages/UpdateEducation.js

export class UpdateEducationPage {
    constructor(page) {
      this.page = page;
  
      // Locators - Profile navigation (same as UpdateAbout)
      this.profileMenu = page.locator('//*[@id="root"]/div[2]/header/div/div[2]/div[2]/div[1]/div/div[1]/div');
      this.ProfileButton = page.getByText('Profile', { exact: true });
  
      // Edit Education button - UPDATED locator
      this.editEducationButton = page.locator("button[title='Edit'] svg path");
  
      // Education form fields
      this.schoolTextbox = page.getByRole('textbox', { name: /e\.g\., Harvard University/i });
      this.degreeTextbox = page.getByRole('textbox', { name: /e\.g\., Bachelor of Science/i });
      this.fieldOfStudyTextbox = page.getByRole('textbox', { name: 'e.g., Computer Science' });
      this.gpaTextbox = page.getByRole('textbox', { name: /e\.g\., 3\.8 GPA/i });
      this.locationTextbox = page.getByRole('textbox', { name: /e\.g\., Cambridge, MA/i });
      this.startDateTextbox = page.getByRole('textbox', { name: /Start Date \*/i });
      this.endDateTextbox = page.getByRole('textbox', { name: /End Date \*/i });
      this.presentCheckbox = page.getByRole('checkbox');
      this.descriptionTextbox = page.getByRole('textbox', { name: /Describe your studies, achievements, activities\.\.\./i });
  
      // Action buttons
      this.addEducationButton = page.getByRole('button', { name: /Add Education/i });
      this.saveChangesButton = page.getByRole('button', { name: /Save Changes/i });
      this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    }
  
    async clickProfile() {
      await this.profileMenu.waitFor({ state: 'visible', timeout: 10000 });
      await this.profileMenu.click();
    }
  
    async openProfile() {
      await this.ProfileButton.waitFor({ state: 'visible' });
      await this.page.waitForLoadState('networkidle');
      await this.ProfileButton.click();
    }
  
    async clickEditEducation() {
      await this.editEducationButton.click({ force: true });
    }
  
    async fillSchool(school) {
        await this.schoolTextbox.fill(school);
    }
  
    async fillDegree(degree) {
      await this.degreeTextbox.fill(degree);
    }
  
    async fillFieldOfStudy(field) {
      await this.fieldOfStudyTextbox.fill(field);
    }
  
    async fillGPA(gpa) {
      await this.gpaTextbox.fill(gpa);
    }
  
    async fillLocation(location) {
      await this.locationTextbox.fill(location);
    }
  
    async fillStartDate(date) {
      await this.startDateTextbox.fill(date);
    }
  
    async fillEndDate(date) {
      await this.endDateTextbox.fill(date);
    }
  
    async fillDescription(description) {
      await this.descriptionTextbox.fill(description);
    }
  
    async checkPresent(isPresent = true) {
      if (isPresent) {
        await this.presentCheckbox.check();
      } else {
        await this.presentCheckbox.uncheck();
      }
    }
  
    async clickAddEducation() {
      await this.addEducationButton.click();
    }
  
    async clickSaveChanges() {
      await this.saveChangesButton.click();
    }
  
    async clickCancel() {
      await this.cancelButton.click();
    }
  
    async updateEducation({ school, degree, fieldOfStudy, gpa, location, startDate, endDate, description, isPresent }) {
      await this.clickEditEducation();
      
        if (school !== undefined) await this.fillSchool(school);
      if (degree !== undefined) await this.fillDegree(degree);
      if (fieldOfStudy !== undefined) await this.fillFieldOfStudy(fieldOfStudy);
      if (gpa !== undefined) await this.fillGPA(gpa);
      if (location !== undefined) await this.fillLocation(location);
      if (startDate !== undefined) await this.fillStartDate(startDate);
      if (isPresent) {
        await this.checkPresent(true);
      } else if (endDate !== undefined) {
        await this.fillEndDate(endDate);
      }
      if (description !== undefined) await this.fillDescription(description);
      
      await this.clickSaveChanges();
    }
  
    async addEducation({ school, degree, fieldOfStudy, gpa, location, startDate, endDate, description, isPresent }) {
      await this.clickAddEducation();
      await this.updateEducation({ school, degree, fieldOfStudy, gpa, location, startDate, endDate, description, isPresent });
    }
  }
  
  export default UpdateEducationPage;