// Pages/UpdateAbout.js

export class UpdateAboutPage {
    constructor(page) {
      this.page = page;
  
      // Locators
      this.profileMenu = page.locator('//*[@id="root"]/div[2]/header/div/div[2]/div[2]/div[1]/div/div[1]/div');
      this.ProfileButton = page.getByText('Profile', { exact: true });
      this.bioTextbox = page.getByRole('textbox', { name: 'Bio*' });
      this.editAboutButton = page.locator(
        "//div[@class='bg-white rounded-lg shadow-sm border border-border p-6']//button[@class='p-2 hover:bg-gray-100 rounded-lg transition-colors']//*[name()='svg']//*[name()='path' and contains(@fill,'currentCol')]"
      );
      this.countryTextbox = page.getByRole('textbox', { name: 'Country*' });
      this.phoneTextbox = page.getByRole('textbox', { name: 'Phone Number *' });
      this.locationTextbox = page.getByRole('textbox', { name: 'Location*' });
      this.saveChangesButton = page.getByRole('button', { name: 'Save Changes' });
    }
 // ... inside UpdateAboutPage ...

async clickProfile() {
    await this.profileMenu.waitFor({ state: 'visible', timeout: 10000 });
    await this.profileMenu.click();
  }


  async openProfile() {
    await this.ProfileButton.waitFor({ state: 'visible' });
    await this.page.waitForLoadState('networkidle');
    await this.ProfileButton.click();
  }

    // Click edit icon on About section
    async clickEditAbout() {
        await this.editAboutButton.click({ force: true });
      }
  
    // Fill Bio
    async fillBio(text) {
      await this.bioTextbox.fill(text);
    }
  
    // Fill Country
    async fillCountry(country) {
      await this.countryTextbox.fill(country);
    }
  
    // Fill Phone Number
    async fillPhoneNumber(phone) {
      await this.phoneTextbox.fill(phone);
    }
  
    // Fill Location
    async fillLocation(location) {
      await this.locationTextbox.fill(location);
    }
  
    // Click Save Changes
    async clickSaveChanges() {
      await this.saveChangesButton.click();
    }
  
    // Full flow: update about information
    async updateAbout({ bio, country, phone, location }) {
      await this.clickEditAbout();
      if (bio !== undefined) await this.fillBio(bio);
      if (country !== undefined) await this.fillCountry(country);
      if (phone !== undefined) await this.fillPhoneNumber(phone);
      if (location !== undefined) await this.fillLocation(location);
      await this.clickSaveChanges();
    }
  }
  
  export default UpdateAboutPage;