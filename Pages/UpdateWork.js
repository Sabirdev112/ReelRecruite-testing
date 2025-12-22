// Pages/UpdateWork.js

export class UpdateWorkPage {
  constructor(page) {
    this.page = page;
    this.profileMenu = page.locator('//*[@id="root"]/div[2]/header/div/div[2]/div[2]/div[1]/div/div[1]/div');
    this.profileButton = page.getByText('Profile', { exact: true });

    this.workExperienceSection = page.getByRole('heading', { name: 'Work Experience' });
    this.deleteWorkButton = page.locator('xpath=//*[@id="root"]/div[2]/main/div/div/div[3]/div[2]/div[2]/div/div/div[2]/div[1]/div[2]/div/button[2]');
    this.confirmDeleteButton = page.getByRole('button', { name: 'Ok' });

    this.addWorkButton = this.addWorkButton = page.getByText('Add Work Experience', { exact: true });

    this.companyInput = page.getByRole('textbox', { name: 'e.g., Google' });
    this.positionInput = page.getByRole('textbox', {name: /Senior Software Engineer/i,});

    this.employmentTypeDropdown = page.getByRole('combobox', { name: 'Employment Type' });
    this.locationTypeDropdown = page.getByRole('combobox', { name: 'Location Type' });

    this.startDateInput = page.getByRole('textbox', { name: 'Start Date *' });
    this.endDateInput = page.getByLabel('I currently work here');

    this.descriptionInput = page.getByRole('textbox', {name: /Describe your responsibilities/i,});

    this.achievementInput = page.getByRole('textbox', {name: /add achievement/i,});

    this.skillInput = page.getByRole('textbox', {name: /add skill/i,});
    this.saveButton = page.locator('xpath=//*[@id="root"]/div[2]/main/div/div/div[4]/div/form/div[2]/button[1]');
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
  async selectDropdownByLabel(dropdown, label) {
    await dropdown.waitFor({ state: 'visible' });
    await dropdown.selectOption({ label });
  }
  

  async clearAndFill(input, value) {
    await input.waitFor({ state: 'visible' });
    await input.fill('');
    await input.fill(value);
  }

  async openProfileDropdown() {
    await this.profileMenu.waitFor({ state: 'visible' });
    await this.profileMenu.click();
  }

  async openProfile() {
    await this.profileButton.waitFor({ state: 'visible' });
    await this.profileButton.click();
    await this.page.waitForLoadState('networkidle');
  }
async navigateToWorkSection() {
    await this.workExperienceSection.waitFor({ state: 'visible' });
    await this.workExperienceSection.click();
  }
  async deleteWorkExperience() {
    await this.deleteWorkButton.waitFor({ state: 'visible' });
    await this.deleteWorkButton.click();
  }
  async confirmDelete() {
    await this.confirmDeleteButton.waitFor({ state: 'visible' });
    await this.confirmDeleteButton.click();
  }
  

async deleteIfVisibleAndProceed() {
  const isDeleteVisible = await this.deleteWorkButton.isVisible().catch(() => false);

  if (isDeleteVisible) {
    await this.deleteWorkButton.click();
    await this.confirmDeleteButton.waitFor({ state: 'visible' });
    await this.confirmDeleteButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  // If delete is not visible, it will silently continue
}

  
  async clearAndTypeUsingKeyboard(locator, value) {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
    await locator.press('Control+A');
    await locator.press('Backspace');
    await locator.type(value);
  }

  async clickAddWork() {
    await this.addWorkButton.waitFor({ state: 'visible' });
    await this.addWorkButton.click();
  }

  async addCompany(company){
    await this.clearAndTypeUsingKeyboard(this.companyInput, company);
  }


  async addPosition(position){
    await this.clearAndTypeUsingKeyboard(this.positionInput, position);
  }


  async addEmploymentType(employmentType){
    await this.selectDropdownByLabel(this.employmentTypeDropdown, employmentType);
  }


  async addLocationType(locationType){
    await this.selectDropdownByLabel(this.locationTypeDropdown, locationType);
  }


  async addStartDate(startDate){
    await this.startDateInput.waitFor({ state: 'visible' });
    await this.startDateInput.fill(startDate);
  }


  async addEndDate(){
    await this.endDateInput.waitFor({ state: 'visible' });
    await this.endDateInput.check();
  }


  async addDescription(description){
    await this.clearAndTypeUsingKeyboard(this.descriptionInput, description);
  }


  async addAchievement(achievement){
    await this.achievementInput.waitFor({ state: 'visible' });
    await this.achievementInput.fill(achievement);
    await this.achievementInput.press('Enter');
  }


  async addSkill(skill){
    await this.skillInput.waitFor({ state: 'visible' });
    await this.skillInput.fill(skill);
    await this.skillInput.press('Enter');
  }


  async saveChanges() {
    await this.saveButton.waitFor({ state: 'visible' });
    await this.saveButton.click();
  }


  
  
}