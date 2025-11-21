export class ApplyJobPage {
  constructor(page) {
    this.page = page;
    this.firstJobCard = page.locator("//body/div[@id='root']/div[@class='min-h-screen bg-gray-50']/main[@class='h-screen pt-16']/div[@class='w-full h-full overflow-y-auto bg-gray-50']/div[@class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6']/div[@class='flex flex-col lg:flex-row gap-6']/div[@class='flex-1 min-w-0']/div[@class='space-y-4']/div[1]");
    this.applyNowButton = page.getByRole('button', { name: 'Apply Now' });

    // removed direct global Record Video locator in favor of a parent-scoped getter
    // other locators
    this.startRecordingButton = page.getByRole('button', { name: 'Start Recording' });
    this.stopRecordingButton = page.getByRole('button', { name: 'Stop Recording' });
    this.confirmVideoButton = page.getByRole('button', { name: 'Use This Video' });
    this.answerBox = page.getByRole('main').getByRole('textbox');
    this.submitButton = page.getByRole('button', { name: 'Submit Application' });
  }

  // parent-scoped locator helper for the "Record Video" button
  async getRecordVideoButton({ parentLocator = null, pick = 'upper' } = {}) {
    // If caller provided an explicit parent locator, use its first matching button
    if (parentLocator) {
      return parentLocator.locator('button:has-text("Record Video")').first();
    }

    // Try to find a visible dialog that contains the button (prefer dialog parents)
    const dialogs = this.page.locator('div[role="dialog"]');
    const dlgCount = await dialogs.count();
    for (let i = 0; i < dlgCount; i++) {
      const dlg = dialogs.nth(i);
      // ensure dialog is visible
      if (await dlg.isVisible()) {
        const btnCount = await dlg.locator('button:has-text("Record Video")').count();
        if (btnCount > 0) return dlg.locator('button:has-text("Record Video")').first();
      }
    }

    // Fallback: pick the upper (first) or lower (second) on-page match
    const allBtns = this.page.locator('button:has-text("Record Video")');
    if (pick === 'upper') return allBtns.first();
    return allBtns.nth(1);
  }

  async openJobAndApply() {
    await this.firstJobCard.waitFor({ state: 'visible' });
    await this.firstJobCard.click();

    await this.applyNowButton.waitFor({ state: 'visible' });
    await this.applyNowButton.click();
  }

  async recordVideo() {
    // pick the upper Record Video button explicitly
    const recordBtn = await this.getRecordVideoButton({ pick: 'upper' });
    await recordBtn.waitFor({ state: 'visible', timeout: 10000 });
    await recordBtn.click();

    await this.startRecordingButton.waitFor({ state: 'visible' });
    await this.startRecordingButton.click();
    await this.confirmVideoButton.waitFor({ state: 'visible' });
    await this.confirmVideoButton.click();

    // Simulate a short video duration
    await this.page.waitForTimeout(3000);

    await this.stopRecordingButton.waitFor({ state: 'visible' });
    await this.stopRecordingButton.click();
  }

  async answerQuestion(answer) {
    // Ensure correct apply job page is loaded
    await this.page.waitForURL('**/apply', { timeout: 10000 });

    await this.answerBox.waitFor({ state: 'visible' });
    await this.answerBox.fill(answer);
  }

  async submitApplication() {
    await this.submitButton.waitFor({ state: 'visible' });
    await Promise.all([
      this.page.waitForResponse(res => res.url().includes('/api/applications') && res.ok()),
      this.submitButton.click(),
    ]);
  }
}
