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
    this.locationInput = page.getByRole('textbox', { name: 'Location*' });
    this.countryInptut = page.getByRole('textbox', { name: 'Country*' });
    this.phoneInput = page.getByRole('textbox', { name: 'Phone Number *' });
    this.saveAboutButton = page.getByRole('button', { name: 'Save Changes' });
    //add skills
    this.addSkillButton = page.getByRole('button', { name: 'Add Your Skills' });
    this.skillInput = page.getByRole('textbox', { name: 'Type a skill and press Enter' });
    this.saveSkillsButton = page.getByRole('button', { name: 'Save Changes' });
    //add experience
    this.addExperienceButton = page.getByText('Add Work Experience', { exact: true });
    this.CompanyInput = page.getByRole('textbox', { name: 'e.g., Google' });
    this.positionInput = page.getByRole('textbox', { name: 'e.g., Senior Software Engineer' });
    this.expLocationInput = page.getByRole('textbox', { name: 'e.g., San Francisco, CA' });
    this.expStartDateInput = page.getByRole('textbox', { name: 'Start Date *' });
    this.endDateInput = page.getByLabel('I currently work here');
    this.saveExperienceButton = page.locator('xpath=//*[@id="root"]/div[2]/main/div/div/div[4]/div/form/div[2]/button[1]');
    //add education
    this.addEducationButton = this.addEducationButton = page.getByText('Add Education', { exact: true }).nth(0);
    this.institutionInput = page.getByRole('textbox', { name: 'e.g., Harvard University' });
    this.degreeInput = page.getByRole('textbox', { name: 'e.g., Bachelor of Science' });
    this.fieldInput = page.getByRole('textbox', { name: 'e.g., Computer Science' });
    this.gpaInput = page.getByRole('textbox', { name: 'e.g., 3.8 GPA' });
    this.institutelocation = page.getByRole('textbox', { name: 'e.g., Cambridge, MA' });
    this.eduStartDateInput = page.getByRole('textbox', { name: 'Start Date *' });
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
    await this.editprofileButton.waitFor({ state: 'visible'});
    await this.editprofileButton.click();
    await this.professionalTitleButton.pressSequentially('Software Engineer');
    await this.saveProfileButton.waitFor({ state: 'visible'});
    await this.saveProfileButton.click();
}

    async completeAboutSection() {
        await this.bioButton.waitFor({ state: 'visible'});
        await this.bioButton.click();
        await this.bioInput.pressSequentially('Experienced Software Engineer with a passion for developing innovative programs that expedite the efficiency and effectiveness of organizational success.');
        await this.locationInput.fill('canada');
        await this.countryInptut.fill('United States');
        await this.phoneInput.fill('1234567890');
        await this.saveAboutButton.waitFor({ state: 'visible'});
        await this.saveAboutButton.click();
    }
    async addSkills() {
        await this.addSkillButton.waitFor({ state: 'visible'});
        await this.addSkillButton.click();
        await this.skillInput.pressSequentially("playwright, Selenium, Cucumber");
        await this.skillInput.press('Enter');
        await this.saveSkillsButton.waitFor({ state: 'visible'});
        await this.saveSkillsButton.click();
      }

      async addExperience() {
        await this.addExperienceButton.waitFor({ state: 'visible'});
        await this.addExperienceButton.click();
        await this.CompanyInput.pressSequentially('Tech Solutions Inc.');
        await this.positionInput.pressSequentially('Software Engineer');
        await this.expLocationInput.pressSequentially('New York');
        await this.expStartDateInput.pressSequentially('2022-01-01');
        await this.endDateInput.click();
        await this.saveExperienceButton.click();
      }

      async addEducation() {
        await this.addEducationButton.waitFor({ state: 'visible'});
        await this.addEducationButton.click();
        await this.institutionInput.pressSequentially('State University');  
        await this.degreeInput.pressSequentially('Bachelor of Science');
        await this.fieldInput.pressSequentially('Computer Science');
        await this.gpaInput.pressSequentially('3.8');
        await this.institutelocation.pressSequentially('New York, NY');
        await this.eduStartDateInput.pressSequentially('2022-01-01');

        await this.currentlyStudyingLabel.check();
        await this.descriptionInput.pressSequentially('As a student of computer science i have made many projects during my institue study');
        await this.submitAddEducationButton.click();
      }

      async recordCoverVideo() {
        await this.recordVideoButton.waitFor({ state: 'visible'});
        await this.recordVideoButton.click();
        await this.startRecordingButton.waitFor({ state: 'visible'});
        await this.startRecordingButton.click();
        await this.stopRecordingButton.waitFor({ state: 'visible'});
        await this.stopRecordingButton.click();
        await this.confirmVideoButton.waitFor({ state: 'visible'});
        await this.confirmVideoButton.click();
      }
  async applyNow() {
    await this.applyNowButton.waitFor({ state: 'visible'});
    await this.applyNowButton.click();
  }

  async recordVideo() {
    await this.recordVideoButton.click();
    await this.startRecordingButton.click();
    await this.page.waitForTimeout(10000);
    await this.stopRecordingButton.click();
    await this.confirmVideoButton.waitFor({ state: 'visible'});
    await this.confirmVideoButton.click();
  }

  async submitApplication() {
    await this.submitButton.waitFor({ state: 'visible'});
    await this.submitButton.click();
  }
  
}
