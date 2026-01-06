
import { getBannerImagePath } from '../support/profileMedia.helper';
export class CompanyDetailsPage{
    constructor(page) {
        this.page = page;

       this.profileMenu = page.locator('//*[@id="root"]/div[2]/header/div/div[2]/div[2]/div[1]/div/div[1]/div');
       this.ProfileButton = page.getByText('Profile', { exact: true });
       this.companyDetailsSection = page.getByRole('heading', {name: 'Company Details',});
       this.EditDetailsButton = page.locator("body > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > button:nth-child(2) > span:nth-child(1) > svg:nth-child(1)");
       this.addLogoButton = page.locator( 'input[type="file"][accept="image/*"]');
       this.companyNameInput = page.getByRole('textbox', { name: 'Company Name*' });
       this.TagLineInput = page.getByRole('textbox', { name: 'Tagline' });
       this.descriptionInput = page.getByRole('textbox', { name: 'Description*' });
       this.industryInput = page.getByRole('textbox', { name: 'Industry' });
       this.companySizeInput = page.getByRole('textbox', { name: 'Company Size' });
       this.locationInput = page.getByRole('textbox', { name: 'Add location and press Enter' });
       this.websiteInput = page.getByRole('textbox', { name: 'Website' });
       this.LinkedInInput = page.getByRole('textbox', { name: 'LinkedIn' });
       this.twitterInput = page.getByRole('textbox', { name: 'Twitter' });
       this.FacebookInput = page.getByRole('textbox', { name: 'Facebook' });
       this.contactEmailInput = page.getByRole('textbox', { name: 'Contact Email' });
       this.contactNumberInput = page.getByRole('textbox', { name: 'Contact Phone' });
       this.saveButton = page.getByRole('button', { name: 'Save Changes' });
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
            // Modal did not appear — safe to continue
        }
    } 

     async openProfileMenu() {
        await this.profileMenu.waitFor({ state: 'visible' });
        await this.profileMenu.click();
        await this.page.waitForLoadState('networkidle');
        console.log('Navigated to Profile page');
     }

        async navigateToProfile() {
            await this.ProfileButton.waitFor({ state: 'visible' });
            await this.ProfileButton.click();
            await this.page.waitForLoadState('networkidle');
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
            await this.addLogoButton.waitFor({ state: 'attached' });
            await this.addLogoButton.setInputFiles(bannerPath);
            console.log('Company logo updated');
        }
        async clearAndTypeUsingKeyboard(locator, value) {
            await locator.waitFor({ state: 'visible' });
            await locator.click();
            await locator.press('Control+A'); // use 'Meta+A' for Mac if needed
            await locator.press('Backspace');
            await locator.type(value);
  }
        async updateCompanyName(newText) {
             await this.clearAndTypeUsingKeyboard(this.companyNameInput, newText);
             console.log('Company name updated');
        }
        async updateTagLine(newText) {
             await this.clearAndTypeUsingKeyboard(this.TagLineInput, newText);
             console.log('Tagline updated');
        }
        async updateDescription(newText) {
             await this.clearAndTypeUsingKeyboard(this.descriptionInput, newText);
             console.log('Description updated');
        }
        async updateIndustry(newText) {
             await this.clearAndTypeUsingKeyboard(this.industryInput, newText);
             console.log('Industry updated');
        }
        async updateCompanySize(newText) {
                await this.clearAndTypeUsingKeyboard(this.companySizeInput, newText);
                console.log('Company size updated');
        }
        async updateLocation(newText) {
                await this.clearAndTypeUsingKeyboard(this.locationInput, newText);
                await this.locationInput.press('Enter');
                console.log('Location updated');
        }
        async updateWebsite(newText) {
                await this.clearAndTypeUsingKeyboard(this.websiteInput, newText);
                console.log('Website updated');
        }
        async updateLinkedIn(newText) {
                await this.clearAndTypeUsingKeyboard(this.LinkedInInput, newText);
                console.log('LinkedIn updated');
        }
        async updateTwitter(newText) {
                await this.clearAndTypeUsingKeyboard(this.twitterInput, newText);
                console.log('Twitter updated');
        }
        async updateFacebook(newText) {
                await this.clearAndTypeUsingKeyboard(this.FacebookInput, newText);
                console.log('Facebook updated');
        }
        async updateContactEmail(newText) {
                await this.clearAndTypeUsingKeyboard(this.contactEmailInput, newText);
                console.log('Contact email updated');
        }
        async updateContactNumber(newText) {
                await this.clearAndTypeUsingKeyboard(this.contactNumberInput, newText);
                console.log('Contact number updated');
        }
        async clickSaveChanges() {
            await this.saveButton.waitFor({ state: 'visible' });
            await this.saveButton.click();
            console.log('Changes saved');
        }





}