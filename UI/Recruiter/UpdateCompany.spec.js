import { test } from '@playwright/test';
import { loadCredentials } from '../../support/recruiterCredentials.js';
import { Login } from '../../Pages/Login.js';
import { CompanyDetailsPage } from '../../Pages/UpdateCompanyDetails.js';

const recruiter = loadCredentials()[0];


test('Recruiter updates company details and logo', async ({ page }) => {
  // -------- Login --------
  const loginPage = new Login(page);
  await loginPage.goto();
  await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/my-jobs');
  

  // -------- Company Details --------
  const companyPage = new CompanyDetailsPage(page);

  await companyPage.openProfileMenu();
  await companyPage.navigateToProfile();
  await page.waitForTimeout(3000);
  await companyPage.navigateToCompanyDetails();
  console.log('Navigated to Company Details section.');
  await companyPage.clickEditDetails();
  console.log('Editing company details.');

  await companyPage.updateCompanyLogo();
  console.log('Company logo updated.');
  await companyPage.updateCompanyName('Reel Recruit AI');
  console.log('Company name updated.');
  await companyPage.updateTagLine('Hire smarter with video resumes');
  console.log('Tag line updated.');
  await companyPage.updateDescription('Revolutionizing recruitment with AI-driven video resumes.');
  console.log('Description updated.');
  await companyPage.updateIndustry('Information Technology');
  console.log('Industry updated.');
  await companyPage.updateCompanySize('51-200 employees');
  console.log('Company size updated.');
  await companyPage.updateLocation('New York, NY');
  console.log('Location updated.');
  await companyPage.updateWebsite('https://reelrecruitai.com');
  console.log('Website updated.');
  await companyPage.updateLinkedIn('https://linkedin.com/reelrecruitai');
  console.log('LinkedIn updated.');
  await companyPage.updateTwitter('https://twitter.com/reelrecruitai');
  console.log('Twitter updated.');
  await companyPage.updateFacebook('https://facebook.com/reelrecruitai');
  console.log('Facebook updated.');
  await companyPage.updateContactEmail('IuYQ4@example.com');
  console.log('Contact email updated.');
  await companyPage.updateContactNumber('123-456-7890');
  console.log('Contact number updated.');

  await companyPage.clickSaveChanges();
  console.log('Company details saved.');
});
