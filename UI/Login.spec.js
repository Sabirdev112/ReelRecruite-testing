import {test} from '@playwright/test';
import {Login} from '../Pages/Login.js';

test ('Recruiter logs in successfully', async ({page}) => {
  const login = new Login (page);

  await login.goto();
  await login.login('carlos@gmail.com', 'Carlos@123');
  await login.clickSignIn();
  console.log('Login successful');
});