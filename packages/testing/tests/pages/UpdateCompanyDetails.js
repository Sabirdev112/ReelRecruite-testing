import { BasePage } from './base.page.js';
import { expect } from '@playwright/test';
import { getBannerImagePath } from '../utils/profileMedia.helper.js';
export class CompanyDetailsPage extends BasePage {
    constructor(page) {
        super(page);

       this.profileMenu = page.getByTestId('navbar-user-menu-trigger').first();
       this.ProfileButton = page.getByTestId('navbar-user-menu-item-profile').first();
       this.companyDetailsSection = page.getByTestId('company-profile-section');
       this.EditDetailsButton = page.getByTestId('edit-company-profile-button');
       this.addLogoButton = page.getByTestId('company-logo-upload-button');
       this.companyNameInput = page.locator('#companyName');
       this.TagLineInput = page.locator('#tagline');
       this.descriptionInput = page.locator('#description');
       this.industryInput = page.locator('#industry');
       this.companySizeInput = page.locator('#companySize');
       this.locationInput = page.locator('#headquarters');
       this.websiteInput = page.locator('#website');
       this.LinkedInInput = page.locator('#linkedinUrl');
       this.twitterInput = page.locator('#twitterUrl');
       this.FacebookInput = page.locator('#facebookUrl');
       this.contactEmailInput = page.locator('#contactEmail');
       this.contactNumberInput = page.locator('#contactPhone');
       this.saveButton = page.getByTestId('company-save-changes-button');
}

     async openProfileMenu() {
        await this.profileMenu.waitFor({ state: 'visible' });
        await this.profileMenu.click();
        console.log('Profile menu opened');
     }

        async navigateToProfile() {
            await this.ProfileButton.waitFor({ state: 'visible' });
            await this.ProfileButton.click();
            console.log('Navigated to Profile page');
        }
        async navigateToCompanyDetails() {
            await this.companyDetailsSection.waitFor({ state: 'visible' });
            await this.companyDetailsSection.scrollIntoViewIfNeeded();
            console.log('Scrolled to Company Details section');
        }
        async clickEditDetails() {
            await this.EditDetailsButton.first().waitFor({ state: 'visible' });
            await this.EditDetailsButton.first().click();
            console.log('Edit details button clicked');
        }
        async updateCompanyLogo() {
            const bannerPath = getBannerImagePath();
            await this.page.locator('input[type="file"]').setInputFiles(bannerPath);
            await this.page.locator('input[type="file"]').evaluate(input =>
            input.dispatchEvent(new Event('change', { bubbles: true }))
            );
            console.log('Company logo updated');
        }

        async updateCompanyName(newText) {
             await this.companyNameInput.fill(newText);
             console.log('Company name updated');
        }
        async updateTagLine(newText) {
             await this.TagLineInput.fill(newText);
             console.log('Tagline updated');
        }
        async updateDescription(newText) {
             await this.descriptionInput.fill(newText);
             console.log('Description updated');
        }
        async updateIndustry(newText) {
             await this.industryInput.fill(newText);
             console.log('Industry updated');
        }
        async updateCompanySize(newText) {
                await this.companySizeInput.fill(newText);
                console.log('Company size updated');
        }
        async updateLocation(newText) {
                await this.locationInput.fill(newText);
                console.log('Location updated');
        }
        async updateWebsite(newText) {
                await this.websiteInput.fill(newText);
                console.log('Website updated');
        }
        async updateLinkedIn(newText) {
                await this.LinkedInInput.fill(newText);
                console.log('LinkedIn updated');
        }
        async updateTwitter(newText) {
                await this.twitterInput.fill(newText);
                console.log('Twitter updated');
        }
        async updateFacebook(newText) {
                await this.FacebookInput.fill(newText);
                console.log('Facebook updated');
        }
        async updateContactEmail(newText) {
                await this.contactEmailInput.fill(newText);
                console.log('Contact email updated');
        }
        async updateContactNumber(newText) {
                await this.contactNumberInput.fill(newText);
                console.log('Contact number updated');
        }
        async clickSaveChanges() {
            await this.saveButton.waitFor({ state: 'visible' });
            await this.saveButton.click();
            const responsePromise = this.page.waitForResponse(
                (response) =>
                  response.url().includes('/v1/profile/update') &&
                  ['POST', 'PUT', 'PATCH'].includes(response.request().method()),
              );
              const response = await responsePromise;
              if (!response.ok()) {
                const body = await response.text().catch(() => '<no body>');
                throw new Error(
                  `Company update failed: HTTP ${response.status()} ${response.url()} — ${body}`
                );
              }
            await expect(this.EditDetailsButton.first()).toBeVisible();
            console.log(`Changes saved (HTTP ${response.status()})`);
        }





}

