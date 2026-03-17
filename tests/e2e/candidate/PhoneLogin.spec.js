import {test} from '../../fixtures/base.fixtures.js';
import {loadCredentials} from '../../utils/recruiterCredentials.js';


const recruiter = loadCredentials()[0];


test('Candidate can log in using phone number', async ({ page, loginPage }) => {
    
    await loginPage.goto();
    await loginPage.phoneLogin(recruiter.phone, recruiter.password);
    await loginPage.clickSignIn();
}); 

