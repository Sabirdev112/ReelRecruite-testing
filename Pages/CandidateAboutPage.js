export class CandidateAboutPage {
  constructor(page) {
    this.page = page;

    // Open profile: visible left-aligned block that contains the candidate name (matches <div class="hidden lg:block text-left">…</div>)
    this.avatar = page.locator("//p[@class='text-xs capitalize text-gray-500']"); // flexible alt/name
    this.profileMenuItem = page.locator('div').filter({ hasText: /^Profile$/ });

    // Edit About button (first card action)
    this.editAboutButton = page.locator('.flex.items-center.justify-between > .p-2.hover\\:bg-gray-100').first();

    // About form fields
    this.bioInput = page.getByRole('textbox', { name: 'Bio' });
    this.locationInput = page.getByRole('textbox', { name: 'Location' });
    this.countryInput = page.getByRole('textbox', { name: 'Country' });
    this.phoneInput = page.getByRole('textbox', { name: 'Phone Number' });

    // Save
    this.saveButton = page.getByRole('button', { name: 'Save Changes' });
  }

  // Open the profile page (assumes user is already logged in)
  async openProfile() {
    await this.avatar.waitFor({ state: 'visible', timeout: 10000 });
    await this.avatar.click();
    await this.profileMenuItem.waitFor({ state: 'visible', timeout: 10000 });
    await this.profileMenuItem.click();
  }


  // Open the About editor section
  async openAboutEditor() {
    await this.editAboutButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.editAboutButton.click();
    // allow form to appear
    await this.page.waitForTimeout(300);
  }

  // Update about details. Pass only fields you want to change.
  async updateAbout({ bio, location, country, phone } = {}) {
    if (bio !== undefined) {
      await this.bioInput.waitFor({ state: 'visible', timeout: 5000 });
      // clear + fill
      await this.bioInput.fill(bio);
    }

    if (location !== undefined) {
      await this.locationInput.waitFor({ state: 'visible', timeout: 5000 });
      await this.locationInput.fill(location);
    }

    if (country !== undefined) {
      await this.countryInput.waitFor({ state: 'visible', timeout: 5000 });
      await this.countryInput.fill(country);
    }

    if (phone !== undefined) {
      await this.phoneInput.waitFor({ state: 'visible', timeout: 5000 });
      await this.phoneInput.fill(phone);
    }
  }

  // Save changes
  async saveChanges() {
    await this.saveButton.waitFor({ state: 'visible', timeout: 5000 });
    await Promise.all([
      this.page.waitForLoadState('networkidle'),
      this.saveButton.click()
    ]);
  }
}