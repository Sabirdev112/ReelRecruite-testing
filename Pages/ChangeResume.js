
import { getResumePath } from '../support/resume.helper.js';
import {expect} from '@playwright/test';
export class UploadResume {
    constructor(page) { 
        this.page = page;       

        // -------- Profile navigation --------
        this.profileMenu = page.locator('//*[@id="root"]/div[2]/header/div/div[2]/div[2]/div[1]/div/div[1]/div');
        this.ProfileButton = page.getByText('Profile', { exact: true });

        // -------- Resume section --------
        this.resumeSection = page.getByRole('heading', { name: 'Resume', exact: true });

        // -------- Resume actions --------
        this.deleteResumeButton = page.getByRole('button', { name: 'Remove Resume' });
        this.confirmDeleteButton = page.getByRole('button', { name: 'Ok' });

        // -------- Modal --------
        this.maybeLaterButton = page.getByRole('button', { name: 'Maybe Later' });

        // -------- Upload --------
        this.uploadInput = page.locator('#resume-upload');
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
        await this.handleMaybeLaterIfPresent();
    }

    async goToProfile() {
        await this.ProfileButton.waitFor({ state: 'visible' });
        await this.ProfileButton.click();
        await this.handleMaybeLaterIfPresent();
        await this.page.waitForLoadState('networkidle');

    }

    async navigateToResumeSection() {
        await this.resumeSection.waitFor({ state: 'visible' });
        await this.resumeSection.scrollIntoViewIfNeeded();
    
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
            await this.page.waitForLoadState('networkidle');
        }
    }


  

  async uploadNewResume(filename = 'Bold-Poster.pdf') {
    await this.handleMaybeLaterIfPresent();

    const resumePath = getResumePath(filename);

    await this.uploadInput.waitFor({ state: 'attached' });
    await this.uploadInput.setInputFiles(resumePath);
    

    // Trigger frontend update
    await this.uploadInput.evaluate(input =>
      input.dispatchEvent(new Event('change', { bubbles: true }))
    );

    await this.page.waitForTimeout(10000);
    console.log(`Resume uploaded successfully: ${resumePath}`);
  }
}

