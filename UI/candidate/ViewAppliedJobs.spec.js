import {test} from '@playwright/test';
import { loadCandidateCredentials } from '../../support/candidateCredentials.js';
import { Login } from '../../Pages/Login.js';
import { viewAppliedJobPage } from '../../Pages/ViewAppliedJob.js';

const candidate = loadCandidateCredentials()[0];


test ('Candidate views applied jobs', async ({ page }) => {
      const loginPage = new Login(page);
      const viewAppliedJobs = new viewAppliedJobPage(page);
      await loginPage.goto();
      await loginPage.login(candidate.email, candidate.password);
      await loginPage.clickSignIn();
      await page.waitForURL('**/jobs');
      await viewAppliedJobs.clickViewAppliedJobs();
    
    });