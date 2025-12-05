export class SignupPage {
  constructor(page) {
    this.page = page;
    this.otpinput1 = page.getByRole('textbox', { name: 'Digit 1' });
    this.otpinput2 = page.getByRole('textbox', { name: 'Digit 2' });
    this.otpinput3 = page.getByRole('textbox', { name: 'Digit 3' });
    this.otpinput4 = page.getByRole('textbox', { name: 'Digit 4' });
    this.otpinput5 = page.getByRole('textbox', { name: 'Digit 5' });
    this.otpinput6 = page.getByRole('textbox', { name: 'Digit 6' });
    this.registerButton = page.getByRole('button', { name: 'Register' });

    this.fullNameInput = page.getByRole('textbox', { name: 'Enter full name' });
    this.emailInput = page.getByRole('textbox', { name: 'Enter email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Create password' });
    this.confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm password' });

    this.selectRoleDropdown = page.locator('div.react-select__input-container.css-19bb58m');
    this.selectRole = page.getByRole('option', { name: 'Job Seeker' });

    this.signUpButton = page.locator('//*[@id="root"]/div[2]/div[2]/div/div[2]/form/button');
  }

  async goto() {
    await this.page.goto('https://recruitai-web-production.up.railway.app/auth');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async register() {
    await this.registerButton.click();
  }

  async signup(fullName, email, password, confirmPassword) {
    await this.fullNameInput.pressSequentially(fullName);
    await this.emailInput.pressSequentially(email);
    await this.passwordInput.pressSequentially(password);
    await this.confirmPasswordInput.pressSequentially(confirmPassword);

    await this.selectRoleDropdown.click();
    await this.selectRole.click();

  }
    async createAccount() {
  await this.signUpButton.click();
  // Wait 3 seconds before next user
  await this.page.waitForTimeout(3000);
}
async fillOTP(otp) {
    const digits = otp.split('');
    if (digits.length !== 6) {
      throw new Error('OTP must be exactly 6 digits.');
    }
    await this.otpinput1.fill(digits[0]);
    await this.otpinput2.fill(digits[1]);
    await this.otpinput3.fill(digits[2]);
    await this.otpinput4.fill(digits[3]);
    await this.otpinput5.fill(digits[4]);
    await this.otpinput6.fill(digits[5]);
  }
}
