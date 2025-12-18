import fs from 'fs';

export class UploadResume {
    constructor(page) { 
        this.page = page;

        // -------- Profile navigation --------
        this.profileMenu = page.locator('//*[@id="root"]/div[2]/header/div/div[2]/div[2]/div[1]/div/div[1]/div');
        this.ProfileButton = page.getByText('Profile', { exact: true });

        // -------- Resume section --------
        this.resumeSection = page.getByText('Resume', { exact: true });

        // -------- Resume actions --------
        this.deleteResumeButton = page.getByRole('button', { name: 'Remove Resume' });
        this.confirmDeleteButton = page.getByRole('button', { name: 'Ok' });

        // -------- Modal --------
        this.maybeLaterButton = page.getByRole('button', { name: 'Maybe Later' });

        // -------- Upload --------
        this.uploadInput = page.locator('#resume-upload');;
    }

    // ---------------- Modal handler ----------------
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

    // ---------------- Profile navigation ----------------
    async clickProfileMenu() {
        await this.profileMenu.waitFor({ state: 'visible' });
        await this.profileMenu.click();
    }

    async goToProfile() {
        await this.ProfileButton.waitFor({ state: 'visible' });
        await this.ProfileButton.click();

        // Handle modal after profile navigation
        await this.handleMaybeLaterIfPresent();
    }

    async navigateToResumeSection() {
        await this.resumeSection.scrollIntoViewIfNeeded();
        await this.resumeSection.waitFor({ state: 'visible' });

        // Handle modal if it appears after scrolling
        await this.handleMaybeLaterIfPresent();
    }

    // ---------------- Resume management ----------------
    async deleteExistingResume() {
        // If upload button is already visible, skip delete
        if (await this.uploadInput.isVisible()) {
            return;
        }

        if (await this.deleteResumeButton.isVisible()) {
            await this.deleteResumeButton.click();
            await this.page.waitForTimeout(500);

            // Handle modal that may appear after delete
            await this.handleMaybeLaterIfPresent();

            // Confirm deletion
            await this.confirmDelete();
        }
    }

    async confirmDelete() {
        if (await this.confirmDeleteButton.isVisible()) {
            await this.confirmDeleteButton.click();
            await this.page.waitForTimeout(300);
        }
    }

  

async uploadNewResume(resumePath) {
    // Handle modal if present
    await this.handleMaybeLaterIfPresent();

    // Wait for file input to exist in DOM
    await this.uploadInput.waitFor({ state: 'attached' });

    // Verify file exists
    if (!fs.existsSync(resumePath)) {
        throw new Error('Resume file not found: ' + resumePath);
    }

    // Upload the file
    await this.uploadInput.setInputFiles(resumePath);

    // Optional: wait for frontend to process upload
    await this.page.waitForTimeout(5000);
}



}
