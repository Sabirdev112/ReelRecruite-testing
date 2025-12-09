export class ApplyJobPage {
  constructor(page) {
    this.page = page;
    this.completeprofileButton = page.getByRole('button', { name: 'Go to Profile' });
    //add profile data
    this.editprofileButton = page.locator("body > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > button:nth-child(1) > svg:nth-child(1)");
    this.professionalTitleButton = page.getByRole('textbox', { name: 'Professional Title*' });
    this.saveProfileButton = page.getByRole('button', { name: 'Save Changes' });
    //About section
    this.bioButton = page.getByRole('button', { name: 'Add About Information' });
    this.bioInput = page.getByRole('textbox', { name: 'Bio*' })
    this.locationInput = page.getByPlaceholder('e.g., San Francisco, CA');
    this.countryInptut = page.getByRole('textbox', { name: 'Country*' });
    this.phoneInput = page.getByRole('textbox', { name: 'Phone Number *' });
    this.saveAboutButton = page.getByRole('button', { name: 'Save Changes' });
    //add skills
    this.addSkillButton = page.getByRole('button', { name: 'Add Your Skills' });
    this.skillInput = page.getByRole('textbox', { name: 'Type a skill and press Enter' });
    this.saveSkillsButton = page.getByRole('button', { name: 'Save Changes' });
    //add experience
    this.addExperienceButton = page.getByRole('button', { name: 'Add Work Experience' });
    this.CompanyInput = page.getByRole('textbox', { name: 'e.g., Google' });
    this.positionInput = page.getByRole('textbox', { name: 'e.g., Senior Software Engineer' });
    this.locationInput = page.getByRole('textbox', { name: 'e.g., San Francisco, CA' });
    this.startDateInput = page.getByRole('textbox', { name: 'Start Date *' });
    this.endDateInput = page.getByLabel('I currently work here');
    this.saveExperienceButton = page.getByRole('button', { name: 'Add Experience' });
    //add education
    this.addEducationButton = page.getByRole('button', { name: 'Add Education' });
    this.institutionInput = page.getByRole('textbox', { name: 'e.g., Harvard University' });
    this.degreeInput = page.getByRole('textbox', { name: 'e.g., Bachelor of Science' });
    this.fieldInput = page.getByRole('textbox', { name: 'e.g., Computer Science' });
    this.gpaInput = page.getByRole('textbox', { name: 'e.g., 3.8 GPA' });
    this.institutelocation = page.getByRole('textbox', { name: 'e.g., Cambridge, MA' });
    this.startDateInput = page.getByRole('textbox', { name: 'Start Date *' });
    this.currentlyStudyingLabel = page.locator('label').filter({ hasText: 'I am currently studying here' });
    this.descriptionInput = page.getByRole('textbox', { name: 'Describe your studies,' });
    this.submitAddEducationButton = page.locator('button').filter({ hasText: 'Add Education' });
    //Record Cover Video
    this.recordVideoButton = page.getByRole('button', { name: 'Record Video' });
    this.startRecordingButton = page.getByRole('button', { name: 'Start Recording' });
    this.stopRecordingButton = page.getByRole('button', { name: 'Stop Recording' });
    this.confirmVideoButton = page.getByRole('button', { name: 'Use This Video' });
    //Apply to job
    this.applyNowButton = page.getByRole('button', { name: 'Apply Now' });
    this.recordVideoButton = page.getByRole('button', { name: 'Record Video' });
    this.startRecordingButton = page.getByRole('button', { name: 'Start Recording' });
    this.stopRecordingButton = page.getByRole('button', { name: 'Stop Recording' });
    this.confirmVideoButton = page.getByRole('button', { name: 'Use This Video' });
    this.submitButton = page.getByRole('button', { name: 'Submit Application' });
    
  }
  async gotoProfile(){
    await this.completeprofileButton.click();
  }
 

async profileData(){
    await this.editprofileButton.click();
    await this.professionalTitleButton.pressSequentially('Software Engineer');
    await this.saveProfileButton.click();
}

    async completeAboutSection() {
        await this.bioButton.click();
        await this.bioInput.pressSequentially('Experienced Software Engineer with a passion for developing innovative programs that expedite the efficiency and effectiveness of organizational success.');
        await this.locationInput.pressSequentially('New York, NY');
        await this.countryInptut.pressSequentially('United States');
        await this.phoneInput.pressSequentially('1234567890');
        await this.saveAboutButton.click();
    }
    async addSkills() {
        await this.addSkillButton.click();
        await this.skillInput.pressSequentially("playwright, Selenium, Cucumber");
        await this.skillInput.press('Enter');
        await this.saveSkillsButton.click();
      }

      async addExperience() {
        await this.addExperienceButton.click();
        await this.CompanyInput.pressSequentially('Tech Solutions Inc.');
        await this.positionInput.pressSequentially('Software Engineer');
        await this.locationInput.pressSequentially('New York, NY');
        await this.startDateInput.pressSequentially('2022-01-01');
        await this.endDateInput.check();
        await this.saveExperienceButton.click();
      }

      async addEducation() {
        await this.addEducationButton.click();
        await this.institutionInput.pressSequentially('State University');  
        await this.degreeInput.pressSequentially('Bachelor of Science');
        await this.fieldInput.pressSequentially('Computer Science');
        await this.gpaInput.pressSequentially('3.8');
        await this.institutelocation.pressSequentially('New York, NY');
        await this.startDateInput.pressSequentially('2022-01-01');
        await this.currentlyStudyingLabel.click();
        await this.descriptionInput.pressSequentially('As a student of computer science i have made many projects during my institue study');
        await this.submitAddEducationButton.click();
      }

      async recordCoverVideo() {
        await this.recordVideoButton.click();
        await this.startRecordingButton.click();
        await this.stopRecordingButton.click();
        await this.confirmVideoButton.click();
      }
  async applyNow() {
    await this.applyNowButton.click();
  }

  async recordVideo() {
    await this.recordVideoButton.click();
    await this.startRecordingButton.click();
    await this.stopRecordingButton.click();
    await this.confirmVideoButton.click();
  }

  async submitApplication() {
    await this.submitButton.click();
  }

   async scrollDown(pixels = 300) {
     await this.page.waitForTimeout(1500);
  await this.page.evaluate((y) => window.scrollBy(0, y), pixels);
   await this.page.waitForTimeout(1500);
}
  
}
