export class LoginPage {
  constructor(page) {
    this.page = page;
    this.otpinput1 = page.getByRole('textbox', { name: 'Digit 1' });
    this.otpinput2 = page.getByRole('textbox', { name: 'Digit 2' });
    this.otpinput3 = page.getByRole('textbox', { name: 'Digit 3' });
    this.otpinput4 = page.getByRole('textbox', { name: 'Digit 4' });
    this.otpinput5 = page.getByRole('textbox', { name: 'Digit 5' });
    this.otpinput6 = page.getByRole('textbox', { name: 'Digit 6' });
    this.usernameInput = page.getByRole('textbox', { name: 'Enter your email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Enter your password' });
    this.signInButtonLocator = this.page.locator('button[type="submit"]', { hasText: 'Sign In' });
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
async fillOTP(otp) {
    const digits = otp.split('');
    await this.otpinput1.fill(digits[0]);
    await this.otpinput2.fill(digits[1]);
    await this.otpinput3.fill(digits[2]);
    await this.otpinput4.fill(digits[3]);
    await this.otpinput5.fill(digits[4]);
    await this.otpinput6.fill(digits[5]);
  }
  async logout() {
    await this.avatar.click();
    await this.signoutButton.click();
  }
}
