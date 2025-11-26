export class SignupPage {
  constructor(page) {
    this.page = page;

    this.registerButton = page.getByRole('button', { name: 'Register' });

    this.fullNameInput = page.getByRole('textbox', { name: 'Enter full name' });
    this.emailInput = page.getByRole('textbox', { name: 'Enter email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Create password' });
    this.confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm password' });

    this.selectRoleDropdown = page.locator('div.react-select__input-container.css-19bb58m');
    this.selectRole = page.getByRole('option', { name: 'Job Seeker' });

    this.signUpButton = page.getByRole('button', { name: 'Create Account' });
  }

  async goto() {
    await this.page.goto('https://recruitai-web-production.up.railway.app/auth');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async register() {
    await this.registerButton.click();
  }

  async signup(fullName, email, password, confirmPassword) {
    await this.fullNameInput.fill(fullName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword);

    await this.selectRoleDropdown.click();
    await this.selectRole.click();

    // Click Create Account
    await this.signUpButton.click();

    // Wait for toast to confirm DB entry
    await this.page.getByText('Account created! Please signin now.').waitFor();
  }
}
