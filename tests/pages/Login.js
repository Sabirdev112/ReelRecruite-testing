import { expect } from '@playwright/test';
import { BasePage } from './base.page.js';

export class Login extends BasePage {
    constructor(page) {
        super(page);

        this.usernameInput = page.getByTestId('signin-email');
        this.phonePage = page.getByTestId('login-type-phone');
        this.phoneInput = page.getByPlaceholder('Enter phone number');
        this.passwordInput = page.getByTestId('signin-password');
        this.signInButtonLocator = page.getByTestId('signin-submit-button');
        this.avatar = page.getByTestId('navbar-user-avatar');
        this.signoutButton = page.getByTestId('navbar-user-menu-item-logout');
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
        }
    }
    async goto() {
        await this.page.goto('https://recruitai-web-production.up.railway.app/auth');
    }

    async phoneLogin(phone, password) {
        await this.phonePage.waitFor({ state: 'visible' });
        await this.phonePage.click();
        await this.phoneInput.waitFor({ state: 'visible' });
        await this.phoneInput.click();
        await this.phoneInput.fill(phone, { delay: 40 });
        await this.passwordInput.waitFor({ state: 'visible' });
        await this.passwordInput.click();
        await this.passwordInput.pressSequentially(password, { delay: 40 });
        await this.passwordInput.blur();
    }
    async login(email, password) {

        await this.usernameInput.waitFor({ state: 'visible' });
        await this.usernameInput.click();
        await this.usernameInput.pressSequentially(email, { delay: 40 });
        await this.passwordInput.waitFor({ state: 'visible' });
        await this.passwordInput.click();
        await this.passwordInput.pressSequentially(password, { delay: 40 });
        await this.passwordInput.blur();
    }
    async clickSignIn() {
        await this.signInButtonLocator.waitFor({ state: 'visible' });
        await this.signInButtonLocator.click();
        await this.handleMaybeLaterIfPresent();
        console.log('Login successful.');
    }
    async logout() {
        await this.avatar.click();
        await this.signoutButton.waitFor({ state: 'visible' });
        await this.signoutButton.click();
        console.log('Logout successful.');
    }
};