import {test} from '@playwright/test';
import {Login} from '../../Pages/Login.js';
import { SaveDraft } from '../../Pages/SaveDraft.js';

test ('Recruiter saves a job draft', async ({page}) => {
  const login = new Login (page);
  const saveDraft = new SaveDraft (page);

  await login.goto();
  await login.login('carlos@gmail.com', 'Carlos@123');
  await login.clickSignIn();
  await saveDraft.postJob();
  await saveDraft.fillBasicInfo();
  await saveDraft.saveDraft();
  
});