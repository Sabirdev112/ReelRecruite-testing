// Pages/UpdateSkils.js

export class UpdateSkillsPage {
    constructor(page) {
      this.page = page;
  
      // Locators - Profile navigation (same as UpdateAbout)
      this.profileMenu = page.locator('//*[@id="root"]/div[2]/header/div/div[2]/div[2]/div[1]/div/div[1]/div');
      this.ProfileButton = page.getByText('Profile', { exact: true });
  
      // Edit Skills button
      this.editSkillsButton = page.locator("//button[@title='Edit Skills']//*[name()='svg']//*[name()='path' and contains(@fill,'currentCol')]");
  
      // Skills form field
      this.skillsTextbox = page.getByRole('textbox', { name: 'Type a skill and press Enter' });
  
      // Action buttons
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
  
    // Click edit icon on Skills section
    async clickEditSkills() {
      await this.editSkillsButton.click({ force: true });
      // Wait for skills textbox to be visible
      await this.skillsTextbox.waitFor({ state: 'visible', timeout: 10000 });
    }
  
    // Add a skill (type skill and press Enter)
    async addSkill(skill) {
      await this.skillsTextbox.waitFor({ state: 'visible' });
      await this.skillsTextbox.fill(skill);
      await this.skillsTextbox.press('Enter');
      await this.page.waitForTimeout(500); // Wait for skill to be added
    }
  
    // Add multiple skills
    async addSkills(skills) {
      for (const skill of skills) {
        await this.addSkill(skill);
      }
    }
  
    // Click Save Changes
    async clickSaveChanges() {
      await this.saveChangesButton.waitFor({ state: 'visible' });
      await this.saveChangesButton.click();
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(1000); // Wait for save to complete
    }
  
    // Click Cancel
    async clickCancel() {
      await this.cancelButton.click();
    }
  
    // Full flow: update skills
    async updateSkills(skills) {
      await this.clickEditSkills();
      if (Array.isArray(skills)) {
        await this.addSkills(skills);
      } else {
        await this.addSkill(skills);
      }
      await this.clickSaveChanges();
    }
  }
  
  export default UpdateSkillsPage;