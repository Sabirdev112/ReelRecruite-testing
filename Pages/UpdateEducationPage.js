export class UpdateEducationPage {
  constructor(page) {
    this.page = page;

    // Profile navigation
    this.avatar = page.locator("//p[@class='text-xs capitalize text-gray-500']"); // flexible alt/name
    this.profileMenuItem = page.locator('div').filter({ hasText: /^Profile$/ });

    // Education form
    this.addEducationButton = page.getByRole('button', { name: 'Add Education' });
    this.institutionInput = page.getByRole('textbox', { name: 'e.g., Harvard University' });
    this.degreeInput = page.getByRole('textbox', { name: 'e.g., Bachelor of Science' });
    this.fieldInput = page.getByRole('textbox', { name: 'e.g., Computer Science' });
    this.gpaInput = page.getByRole('textbox', { name: 'e.g., 3.8 GPA' });
    this.locationInput = page.getByRole('textbox', { name: 'e.g., Cambridge, MA' });
    this.startDateInput = page.getByRole('textbox', { name: 'Start Date *' });
    this.currentlyStudyingLabel = page.locator('label').filter({ hasText: 'I am currently studying here' });
    this.descriptionInput = page.getByRole('textbox', { name: 'Describe your studies,' });
    this.submitAddEducationButton = page.locator('button').filter({ hasText: 'Add Education' });

    // Remove / confirm
    this.deleteButtons = page.getByRole('button', { name: 'Delete' });
    this.confirmOkButton = page.getByRole('button', { name: 'Ok' });
  }


  async openProfile() {
    await this.avatar.waitFor({ state: 'visible', timeout: 10000 });
    await this.avatar.click();
    await this.profileMenuItem.waitFor({ state: 'visible', timeout: 10000 });
    await this.profileMenuItem.click();
  }

  async addEducation(details = {}) {
    const {
      institution = 'superior university',
      degree = 'BSCS',
      field = 'Computer Science',
      gpa = '3.4',
      location = 'Lahore',
      startDate = '2021-02-21',
      currentlyStudying = true,
      description = 'As a student of computer science i have made many projects during my institue study'
    } = details;

    await this.addEducationButton.click();
    await this.institutionInput.fill(institution);
    await this.degreeInput.fill(degree);
    await this.fieldInput.fill(field);
    await this.gpaInput.fill(gpa);
    await this.locationInput.fill(location);
    await this.startDateInput.fill(startDate);

    if (currentlyStudying) {
      await this.currentlyStudyingLabel.click();
    }

    await this.descriptionInput.fill(description);
    await this.submitAddEducationButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async deleteEducationAt(index = 0) {
    // index is 0-based like nth in codegen; codegen used .nth(3) so pass 3 when needed
    await this.deleteButtons.nth(index).click();
    await this.confirmOkButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}