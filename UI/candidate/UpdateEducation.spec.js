import { test, expect } from '@playwright/test';
import { Login } from '../../Pages/Login.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { UpdateEducationPage } from '../../Pages/UpdateEducation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load candidate credentials
const candidate = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../fixtures/Candidate/Credentials.json'),
    'utf-8'
  )
)[0];

// Sample updated education data
const updatedEducation = {
  school: 'Harvard University',
  degree: 'Bachelor of Science',
  fieldOfStudy: 'Computer Science',
  gpa: '3.9',
  location: 'Cambridge, MA',
  startDate: '2021-01-01',
  description: 'Updated description of studies and achievements.'
};

test('candidate can update education', async ({ page }) => {
  const loginPage = new Login(page);
  const educationPage = new UpdateEducationPage(page);

  // Navigate to login page and login
  await loginPage.goto();
  await loginPage.login(candidate.email, candidate.password);
  await loginPage.clickSignIn();
  await page.waitForURL('**/jobs');
  await educationPage.handleMaybeLaterIfPresent();

  // Navigate to candidate profile
  await educationPage.clickProfile();
  await educationPage.openProfile();

 
  
  await educationPage.navigateToEducation();
  await educationPage.deleteIfVisibleAndProceed();
  console.log('Education deleted.');
  await educationPage.clickAddEducation();
  console.log('Add education clicked.');
  await educationPage.updateSchool(updatedEducation.school);
  console.log('School updated.');
  await educationPage.updateDegree(updatedEducation.degree);
  console.log('Degree updated.');
  await educationPage.updateFieldOfStudy(updatedEducation.fieldOfStudy);
  console.log('Field of study updated.');
  await educationPage.updateGPA(updatedEducation.gpa);
  console.log('GPA updated.');
  await educationPage.updateLocation(updatedEducation.location);
  console.log('Location updated.');
  await educationPage.updateStartDate(updatedEducation.startDate);
  console.log('Start date updated.');
  await educationPage.updateEndDate(); 
  console.log('End date updated.');
  await educationPage.updateDescription(updatedEducation.description);
  console.log('Description updated.');
  await educationPage.saveChanges();
  console.log('Education updated successfully.');
});
