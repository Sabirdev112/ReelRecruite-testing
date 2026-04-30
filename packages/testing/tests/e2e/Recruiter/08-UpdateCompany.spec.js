import { test, expect } from '../../fixtures/base.fixtures.js';
import { loadCredentials } from '../../utils/recruiterCredentials.js';
import { getCompanyProfileByEmail } from '../../utils/recruiterDb.helper.js';

const recruiter = loadCredentials()[0];

test('Recruiter updates company details and logo', async ({ page, loginPage, updateCompanyDetails }) => {
  
  await loginPage.goto();
  await loginPage.login(recruiter.email, recruiter.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/my-jobs');
  
  await updateCompanyDetails.openProfileMenu();
  await updateCompanyDetails.navigateToProfile();
  await updateCompanyDetails.navigateToCompanyDetails();
  await updateCompanyDetails.clickEditDetails();
  await updateCompanyDetails.updateCompanyLogo();
  await updateCompanyDetails.updateCompanyName('Reel Recruit AI');
  await updateCompanyDetails.updateTagLine('Hire smarter with video resumes');
  await updateCompanyDetails.updateDescription('Revolutionizing recruitment with AI-driven video resumes.');
  await updateCompanyDetails.updateIndustry('Information Technology');
  await updateCompanyDetails.updateCompanySize('51-200 employees');
  await updateCompanyDetails.updateLocation('New York, NY');
  await updateCompanyDetails.updateWebsite('https://reelrecruitai.com');
  await updateCompanyDetails.updateLinkedIn('https://linkedin.com/reelrecruitai');
  await updateCompanyDetails.updateTwitter('https://twitter.com/reelrecruitai');
  await updateCompanyDetails.updateFacebook('https://facebook.com/reelrecruitai');
  await updateCompanyDetails.updateContactEmail('sabir.dev@example.com');
  await updateCompanyDetails.updateContactNumber('123-456-7890');
  await updateCompanyDetails.clickSaveChanges();

  // Verify DB
  const db = await getCompanyProfileByEmail(recruiter.email);
  expect(db.company_name).toBe('Reel Recruit AI');
  expect(db.tagline).toBe('Hire smarter with video resumes');
  expect(db.website).toBe('https://reelrecruitai.com');
  expect(db.industry).toBe('Information Technology');
  expect(db.company_size).toBe('51-200 employees');
  expect(db.locations).toContain('New York, NY');
  expect(db.contact_email).toBe('sabir.dev@example.com');
  expect(db.contact_phone).toBe('1234567890');
});


