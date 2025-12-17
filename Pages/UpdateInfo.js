

export class UpdateInfoPage {
    constructor(page) {
      this.page = page;
  
      // Locators - Profile navigation (same as UpdateAbout)
      this.profileMenu = page.locator('//*[@id="root"]/div[2]/header/div/div[2]/div[2]/div[1]/div/div[1]/div');
      this.ProfileButton = page.getByText('Profile', { exact: true });
  
      // Edit Profile button (main edit button on profile page)
      this.editProfileButton = page.locator("//button[@class='absolute top-4 right-4 p-2.5 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 transition-colors text-white']//*[name()='svg']");
  
      // Edit Info button
      this.editInfoButton = page.locator("//button[@class='absolute top-4 right-4 p-2.5 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 transition-colors text-white']//*[name()='svg']");
      
      // Alternative edit button locator (if needed)
      this.editInfoButtonAlt = page.locator("body > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > form:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > button:nth-child(2) > svg:nth-child(1) > path:nth-child(1)");
  
      // Image upload buttons (optional - for cover image and profile picture)
      this.coverImageButton = page.locator("//button[@class='absolute bottom-2 right-2 p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 transition-colors']//*[name()='svg']");
      this.profilePictureButton = page.locator("//button[@class='absolute bottom-0 right-0 p-1.5 bg-primary rounded-full hover:bg-primary/90 transition-colors']//*[name()='svg']");
  
      // Form fields
      this.fullNameTextbox = page.getByRole('textbox', { name: /Full Name\*/i });
      this.professionalTitleTextbox = page.getByRole('textbox', { name: /Professional Title\*/i });
  
      // Action buttons
      this.saveChangesButton = page.getByRole('button', { name: /Save Changes/i });
      this.cancelButton = page.getByRole('button', { name: /Cancel/i });
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
  
    // Click main Edit Profile button
    async clickEditProfile() {
      await this.editProfileButton.click({ force: true });
    }
  
    // Click edit icon on Info section
    async clickEditInfo() {
      await this.editInfoButton.click({ force: true });
    }
  
    // Click Cover Image button (optional)
    async clickCoverImage() {
      await this.coverImageButton.click({ force: true });
    }
  
    // Click Profile Picture button (optional)
    async clickProfilePicture() {
      await this.profilePictureButton.click({ force: true });
    }
  
    // Upload Cover Image (if file input appears after clicking)
    async uploadCoverImage(filePath) {
      await this.clickCoverImage();
      const fileInput = this.page.locator('input[type="file"]').first();
      await fileInput.setInputFiles(filePath);
    }
  
    // Upload Profile Picture (if file input appears after clicking)
    async uploadProfilePicture(filePath) {
      await this.clickProfilePicture();
      const fileInput = this.page.locator('input[type="file"]').first();
      await fileInput.setInputFiles(filePath);
    }
  
    // Fill Full Name
    async fillFullName(name) {
      await this.fullNameTextbox.fill(name);
    }
  
    // Fill Professional Title
    async fillProfessionalTitle(title) {
      await this.professionalTitleTextbox.fill(title);
    }
  
    // Click Save Changes
    async clickSaveChanges() {
      await this.saveChangesButton.click();
    }
  
    // Click Cancel
    async clickCancel() {
      await this.cancelButton.click();
    }
  
    // Full flow: update info information
    async updateInfo({ fullName, professionalTitle }) {
      await this.clickEditInfo();
      if (fullName !== undefined) await this.fillFullName(fullName);
      if (professionalTitle !== undefined) await this.fillProfessionalTitle(professionalTitle);
      await this.clickSaveChanges();
    }
  }
  
  export default UpdateInfoPage;