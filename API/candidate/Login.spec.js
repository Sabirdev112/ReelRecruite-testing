import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const payloadPath = path.join(__dirname, '../../fixtures/candidate/Credentials.json');

test('Login API using credentials from JSON', async ({ request }) => {
  // Read credentials from JSON
  const payload = JSON.parse(fs.readFileSync(payloadPath, 'utf-8'));

  // Send POST request to login endpoint
  const response = await request.post(
    'https://recruitai-backend-production.up.railway.app/v1/auth/signin',
    {
      data: payload,
      headers: { 'Content-Type': 'application/json' }
    }
  );

  // Log status and response body
  console.log('Response status:', response.status());
  const responseBody = await response.json();
  console.log('Login response:', responseBody);

  // Basic assertion to check request succeeded
  expect(response.ok()).toBeTruthy();
});
