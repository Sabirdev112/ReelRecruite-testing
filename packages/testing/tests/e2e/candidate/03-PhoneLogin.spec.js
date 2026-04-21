import {test} from '../../fixtures/base.fixtures.js';
import {loadCredentials} from '../../utils/candidateCredentials.js';

const candidate = loadCredentials()[0];
test('Candidate can log in using phone number', async ({ page, loginPage }) => {

    await loginPage.goto();
    await loginPage.phoneLogin(candidate.phone, candidate.password);
    await loginPage.clickSignIn();
}); 
