import { test, expect } from '@playwright/test';
import { Login } from '../../Pages/Login.js';
import { UpdateEducationPage } from '../../Pages/UpdateEducation.js';

test('candidate can update education section', async ({ page }) => {
  const loginPage = new Login(page);
  const updateEducation = new UpdateEducationPage(page);

  await loginPage.goto();
  await loginPage.login('khurrramimran908@gmail.com', 'Tech@12345');
  await loginPage.clickSignIn();
  await updateEducation.clickProfile();
  await updateEducation.openProfile();
  await updateEducation.clickEditEducation();

 
  await updateEducation.updateEducation({
    school: 'University of Technology',
    degree: 'Bachelor of Science',
    fieldOfStudy: 'Computer Science',
    gpa: '3.8',
    location: 'Lahore, Pakistan',
    startDate: '2018-09-01',
    endDate: '2022-06-30',
    description: 'Graduated with honors',
    isPresent: false,
  });
});


// Optional: add an assertion if there is some confirmation text
// await expect(page.getByText('Education updated successfully')).toBeVisible();