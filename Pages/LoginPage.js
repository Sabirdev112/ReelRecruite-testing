export class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.getByRole('textbox', { name: 'Enter your email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Enter your password' });
    this.signInButtonLocator = page.locator('xpath=//*[@id="root"]/div[2]/div[2]/div/div[2]/form/button');
    this.avatar = page.locator("//p[@class='text-xs capitalize text-gray-500']");
    this.signoutButton = page.getByText('Log out', { exact: true });
  }

  async goto() {
    await this.page.goto('https://recruitai-web-production.up.railway.app/auth');
  }

  async login(email, password) {
  await this.usernameInput.click();
  await this.usernameInput.pressSequentially(email, { delay: 40 });

  await this.passwordInput.click();
  await this.passwordInput.pressSequentially(password, { delay: 40 });

  await this.passwordInput.blur();
}


  async clickSignIn() {
    await this.signInButtonLocator.click();
  }
  async logout() {
    await this.avatar.click();
    await this.signoutButton.click();
  }
}
