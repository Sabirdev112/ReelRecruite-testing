import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));
const OUTPUT_FILE = 'verifiedUsers.json';
const results = [];

test('Signup and verify all users', async ({ request }) => {
  for (const user of users) {
    console.log(`\nSigning up: ${user.email}`);

    const signupResp = await request.post(
      'https://recruitai-backend-production.up.railway.app/v1/auth/signup',
      {
        data: {
          userName: user.userName,
          fullName: user.fullName,
          email: user.email,
          password: user.password,
          userType: 'candidate'
        }
      }
    );

    if (!signupResp.ok()) {
      console.log(`Signup failed for ${user.email}`);
      continue;
    }

    const signupData = await signupResp.json();
    const userId = signupData.user?.id;

    const verifyResp = await request.post(
      'https://recruitai-backend-production.up.railway.app/v1/auth/verify-user',
      {
        data: { userId, otp: 123456 }
      }
    );

    if (!verifyResp.ok()) {
      console.log(`Verification failed for ${user.email}`);
      continue;
    }

    const verifyData = await verifyResp.json();

    results.push({
      email: user.email,
      password: user.password,
      id: verifyData.user?.id
    });

    console.log(`Verified: ${user.email}`);
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
  console.log('Finished. Saved verified users to verifiedUsers.json');
});
