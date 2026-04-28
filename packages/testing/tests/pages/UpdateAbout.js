import { BasePage } from './base.page.js';

export class UpdateAboutPage extends BasePage {
    constructor(page) {
        super(page);
  
      this.profileMenu = page.getByTestId('navbar-user-menu-trigger').first();
      this.ProfileButton = page.getByTestId('navbar-user-menu-item-profile').first();
      this.editAboutButton = page.getByTestId('edit-about-button').first();
      this.bioTextbox = page.locator('#bio');
      this.countryTextbox = page.locator('#country');
      this.locationTextbox = page.locator('#location');
      this.saveChangesButton = page.getByTestId('about-save-button');
}
 
  async clickProfile() {
    await this.profileMenu.waitFor({ state: 'visible', timeout: 10000 });
    await this.profileMenu.click();
    console.log('Profile button clicked');
  }


  async openProfile() {
    await this.ProfileButton.waitFor({ state: 'visible' });
    await this.ProfileButton.click();
    console.log('Navigated to Profile page');
  }

  async clickEditAbout() {
    await this.editAboutButton.waitFor({ state: 'visible' });
    await this.editAboutButton.click();
    console.log('Edit About button clicked');
  }
 

  async updateBio(bio) {
    await this.bioTextbox.waitFor({ state: 'visible' });
    await this.bioTextbox.fill(bio);
    console.log('Bio updated successfully');
  }
  
  async updateCountry(country) {
    await this.countryTextbox.waitFor({ state: 'visible' });
    await this.countryTextbox.fill(country);
    console.log('Country updated successfully');
  }
 
  async updateLocation(location) {
    await this.locationTextbox.waitFor({ state: 'visible' });
    await this.locationTextbox.fill(location);
    console.log('Location updated successfully',location);
  }

  async saveChanges() {
    await this.saveChangesButton.waitFor({ state: 'visible' });
    await this.saveChangesButton.click();
    console.log('Changes saved');
  }

}