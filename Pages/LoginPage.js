export class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.getByRole('textbox', { name: 'Enter your email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Enter your password' });
    // Use the scoped form locator to avoid strict mode errors
    this.signInButton = page.locator('form').getByRole('button', { name: 'Sign In' });
  }

  async goto() {
    await this.page.goto('https://recruitai-web-production.up.railway.app/auth');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async login(username, password) {
    await this.usernameInput.waitFor({ state: 'visible' });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);

    // ✅ Use scoped locator + navigation wait
    await Promise.all([
      
      this.signInButton.click(),
    ]);
  }
}
