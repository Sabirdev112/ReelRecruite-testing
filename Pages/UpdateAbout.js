// Pages/UpdateAbout.js

export class UpdateAboutPage {
    constructor(page) {
      this.page = page;
  
      // Locators
      this.profileMenu = page.locator('//*[@id="root"]/div[2]/header/div/div[2]/div[2]/div[1]/div/div[1]/div');
      this.ProfileButton = page.getByText('Profile', { exact: true });

      this.editAboutButton = page.locator('xpath=//*[@id="root"]/div[2]/main/div/div/div[2]/div[1]/button');

      this.bioTextbox = page.getByRole('textbox', { name: 'Bio*' });
      this.countryTextbox = page.getByRole('textbox', { name: 'Country*' });
      this.phoneTextbox = page.getByRole('textbox', { name: 'Phone Number *' });
      this.locationTextbox = page.getByRole('textbox', { name: 'Location*' });
      this.saveChangesButton = page.getByRole('button', { name: 'Save Changes' });
      this.maybeLaterButton = page.getByRole('button', { name: 'Maybe Later' });
    }
 // ... inside UpdateAboutPage ...
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
  async clickProfile() {
    await this.profileMenu.waitFor({ state: 'visible', timeout: 10000 });
    await this.profileMenu.click();
  }


  async openProfile() {
    await this.ProfileButton.waitFor({ state: 'visible' });
    await this.ProfileButton.click();
     await this.page.waitForLoadState('networkidle');
  }

  async clickEditAbout() {
    await this.editAboutButton.waitFor({ state: 'visible' });
    await this.editAboutButton.click();
  }
   async clearAndTypeUsingKeyboard(locator, value) {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
    await locator.press('Control+A');
    await locator.press('Backspace');
    await locator.type(value);
  }

  async updateBio(bio) {
    await this.clearAndTypeUsingKeyboard(this.bioTextbox, bio);
  }
  
  async updateCountry(country) {
    await this.clearAndTypeUsingKeyboard(this.countryTextbox, country);
  }
  
  async updatePhone(phone) {
    await this.clearAndTypeUsingKeyboard(this.phoneTextbox, phone);
  }

  async updateLocation(location) {
    await this.clearAndTypeUsingKeyboard(this.locationTextbox, location);
  }

  async saveChanges() {
    await this.saveChangesButton.waitFor({ state: 'visible' });
    await this.saveChangesButton.click();
  }

}