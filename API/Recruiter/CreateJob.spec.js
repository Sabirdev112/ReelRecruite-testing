import { test, request } from '@playwright/test';
import jobPayload from '../../fixtures/jobs/jobCreation.json';

test('Sign in and create job with questions', async () => {
  const apiContext = await request.newContext();

  // Sign in
  const signinResponse = await apiContext.post(
    'https://recruitai-backend-production.up.railway.app/v1/auth/signin',
    {
      data: {
        email: 'carlos@gmail.com',
        password: 'Carlos@123'
      }
    }
  );

  const signinData = await signinResponse.json();
  const accessToken = signinData.tokens.access_token;

  // Create job
  const createJobResponse = await apiContext.post(
    'https://recruitai-backend-production.up.railway.app/v1/jobs/create',
    {
      data: jobPayload,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  const createJobData = await createJobResponse.json();
  console.log('Job creation response:', createJobData);
});
