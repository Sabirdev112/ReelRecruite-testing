export class UpdateInfoPage {
  constructor(page) {
    this.page = page;
    this.maybeLaterButton = page.getByRole('button', { name: 'Maybe Later' });
    this.profileMenu = page.locator('//*[@id="root"]/div[2]/header/div/div[2]/div[2]/div[1]/div/div[1]/div');
    this.profileButton = page.getByText('Profile', { exact: true });
    this.editProfileButton = page.locator('button.absolute.top-4.right-4');
    this.coverImageInput = page.locator('input[type="file"][accept="image/*"]').first();
    this.profilePictureInput = page.locator('input[type="file"][accept="image/*"]').nth(1);
    this.profilePictureEditButton = page.locator('button.absolute.bottom-2.right-2');

    this.fullNameTextbox = page.getByRole('textbox', { name: /Full Name\*/i });
    this.professionalTitleTextbox = page.getByRole('textbox', { name: /Professional Title\*/i });

    this.saveChangesButton = page.getByRole('button', { name: /Save Changes/i });
    this.cancelButton = page.getByRole('button', { name: /Cancel/i });
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

  async openProfileMenu() {
    await this.profileMenu.waitFor({ state: 'visible' });
    await this.profileMenu.click();
  }
  async clickProfile() {
    await this.profileButton.waitFor({ state: 'visible' });
    await this.profileButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickEditProfile() {
    await this.editProfileButton.waitFor({ state: 'visible' });
    await this.editProfileButton.click();
  }

  // ---------- Uploads ----------
  async uploadCoverImage(bannerPath) {
    await this.coverImageInput.waitFor({ state: 'attached' });
    await this.coverImageInput.setInputFiles(bannerPath);
  }

  async uploadProfilePicture(profilePath) {
    await this.profilePictureEditButton.waitFor({ state: 'visible' });
    await this.profilePictureEditButton.click(); // open file picker
    await this.profilePictureInput.waitFor({ state: 'attached' });
    await this.profilePictureInput.setInputFiles(profilePath);
  }

  // ---------- Form helpers ----------
  async clearAndTypeUsingKeyboard(locator, value) {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
    await locator.press('Control+A');
    await locator.press('Backspace');
    await locator.type(value);
  }

  async fillFullName(name) {
    await this.clearAndTypeUsingKeyboard(this.fullNameTextbox, name);
  }

  async fillProfessionalTitle(title) {
    await this.clearAndTypeUsingKeyboard(this.professionalTitleTextbox, title);
  }

  async clickSaveChanges() {
    await this.saveChangesButton.waitFor({ state: 'visible' });
    await this.saveChangesButton.click();
  }
}
