export class ForgetPassword {
  constructor(page) {
    this.page = page;
    this.forgetPasswordButton = page.getByRole('link', { name: 'Forgot password?' });
    this.emailInput = page.getByRole('textbox', { name: 'you@example.com' });
    this.getCodeButton = page.getByRole('button', { name: 'Send code' });
    this.otpinput1 = page.getByRole('textbox', { name: 'Digit 1' });
    this.otpinput2 = page.getByRole('textbox', { name: 'Digit 2' });
    this.otpinput3 = page.getByRole('textbox', { name: 'Digit 3' });
    this.otpinput4 = page.getByRole('textbox', { name: 'Digit 4' });
    this.otpinput5 = page.getByRole('textbox', { name: 'Digit 5' });
    this.otpinput6 = page.getByRole('textbox', { name: 'Digit 6' });
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.newPasswordInput = page.getByRole('textbox', { name: 'Enter new password' });
    this.confirmPasswordInput = page.getByRole('textbox', { name: 'Re-enter password' });
    this.resetPasswordButton = page.getByRole('button', { name: 'Save password' });
  }
  async clickForgetPassword() {
    await this.forgetPasswordButton.waitFor({ state: 'visible'});
    await this.forgetPasswordButton.click();
  }
    async enterEmail(email) {
      await this.emailInput.waitFor({ state: 'visible'});
      await this.emailInput.fill(email);
    }
    async clickGetCode() {
      await this.getCodeButton.waitFor({ state: 'visible'});
      await this.getCodeButton.click();
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
    async clickContinue() {
      await this.continueButton.waitFor({ state: 'visible'});
      await this.continueButton.click();
    }
    async enterNewPassword(newPassword, confirmPassword) {
      await this.newPasswordInput.waitFor({ state: 'visible'});
      await this.newPasswordInput.fill(newPassword);
      await this.confirmPasswordInput.fill(confirmPassword);
    }
    async clickSavePassword() {
      await this.resetPasswordButton.waitFor({ state: 'visible'});
      await this.resetPasswordButton.click();
    }

}