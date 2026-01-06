import { test, } from '@playwright/test';
import { Login } from '../../Pages/Login.js';
import { loadCredentials } from '../../support/candidateCredentials.js';
import { UpdateEducationPage } from '../../Pages/UpdateEducation.js';

const candidate = loadCredentials()[0];

test('candidate can update education', async ({ page }) => {
  const loginPage = new Login(page);
  const educationPage = new UpdateEducationPage(page);

  // Navigate to login page and login
  await loginPage.goto();
  await loginPage.login(candidate.email, candidate.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/jobs');
  console.log('Candidate logged in successfully.');
  await educationPage.handleMaybeLaterIfPresent();

  // Navigate to candidate profile
  await educationPage.clickProfile();
  await educationPage.openProfile();

 
  
  await educationPage.navigateToEducation();
  await educationPage.deleteIfVisibleAndProceed();
  console.log('Education deleted.');
  await educationPage.clickAddEducation();
  console.log('Add education clicked.');
  await educationPage.updateSchool('Harvard University');
  console.log('School updated.');
  await educationPage.updateDegree('Bachelor of Science');
  console.log('Degree updated.');
  await educationPage.updateFieldOfStudy('Computer Science');
  console.log('Field of study updated.');
  await educationPage.updateGPA('4.0');
  console.log('GPA updated.');
  await educationPage.updateLocation('Boston, MA');
  console.log('Location updated.');
  await educationPage.updateStartDate('2021-01-01');
  console.log('Start date updated.');
  await educationPage.updateEndDate(); 
  console.log('End date updated.');
  await educationPage.updateDescription('Graduated with honors.');
  console.log('Description updated.');
  await educationPage.saveChanges();
  console.log('Education updated successfully.');
});
