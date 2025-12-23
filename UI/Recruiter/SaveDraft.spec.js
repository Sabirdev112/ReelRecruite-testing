import {test} from '@playwright/test';
import fs from 'fs';  
import path from 'path';
import {fileURLToPath} from 'url';
import {Login} from '../../Pages/Login.js';
import { SaveDraft } from '../../Pages/SaveDraft.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load recruiter credentials
const recruiter = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../fixtures/Recruiter/Credentials.json'),
    'utf-8'
  )
)[0];


test ('Recruiter saves a job draft', async ({page}) => {
  const login = new Login (page);
  const saveDraft = new SaveDraft (page);

  await login.goto();
  await login.login(recruiter.email, recruiter.password);
  await login.clickSignIn();
  await page.waitForURL('**/my-jobs');
  await saveDraft.clickIfVisible();
  
  await saveDraft.postJob();
  await saveDraft.fillBasicInfo();
  console.log('Filled basic info');
  await saveDraft.saveDraft();
  console.log('Saved draft');
  
});