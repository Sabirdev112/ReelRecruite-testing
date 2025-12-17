// Pages/UpdateResume.js
export class UpdateResumePage {
    constructor(page) {
      this.page = page;
  
      // Profile navigation
      this.profileMenu = page.locator(
        '//*[@id="root"]/div[2]/header/div/div[2]/div[2]/div[1]/div/div[1]/div'
      );
      this.profileButton = page.getByText('Profile', { exact: true });
  
      // Resume locators
      this.removeResumeButton = page.getByRole('button', { name: 'Remove Resume' });
      this.okButton = page.getByRole('button', { name: 'Ok' });
      this.maybeLaterButton = page.getByRole('button', { name: 'Maybe Later' });
      this.uploadResumeInput = page.locator('#resume-upload'); // hidden input
    }
  
    // Profile navigation
    async clickProfile() {
      await this.profileMenu.waitFor({ state: 'visible' });
      await this.profileMenu.click();
    }
  
    async openProfile() {
      await this.profileButton.waitFor({ state: 'visible' });
      await this.profileButton.click();
      await this.page.waitForLoadState('networkidle');
    }
  
    // Resume actions
    async removeResume() {
      // Only try if button exists
      if (await this.removeResumeButton.count() > 0) {
        await this.removeResumeButton.first().click({ force: true });
  
        // Click "Ok" in confirmation popup
        await this.okButton.waitFor({ state: 'visible' });
        await this.okButton.click({ force: true });
  
        // Wait a little to ensure DOM updates
        await this.page.waitForTimeout(500);
      }
    }
  
    async handleMaybeLaterPopup() {
      if (await this.maybeLaterButton.isVisible()) {
        await this.maybeLaterButton.click({ force: true });
        await this.page.waitForTimeout(700);
      }
    }
  
    async uploadResume(filePath) {
        // Directly set input files
        await this.uploadResumeInput.setInputFiles(filePath);
      
        // Wait for confirmation element or upload completion
        // Example: wait for the Remove Resume button to appear (resume uploaded)
        await this.page.waitForSelector('button:has-text("Remove Resume")', { timeout: 10000 });
      
        // Optional small delay
        await this.page.waitForTimeout(700);
      }
      
    // Full flow: remove & upload resume
    async removeAndUploadResume(filePath) {
      await this.removeResume();
      await this.handleMaybeLaterPopup();
      await this.uploadResume(filePath);
    }
  }
  
  export default UpdateResumePage;
  