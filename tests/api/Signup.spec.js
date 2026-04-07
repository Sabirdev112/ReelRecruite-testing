import { test } from '@playwright/test';
import { runApiCase } from '../utils/api.response.helper.js';
import { getRandomUser, toSignupApiPhone } from '../utils/signupCredentials.helper.js';

test.describe('API SPEC: Signup', () => {
  test('Signup', async ({ request }, testInfo) => {
    const user = getRandomUser();
    await runApiCase(request, testInfo, 'Signup', {
      placeholderOverrides: {
        '{{signup.phone}}': toSignupApiPhone(user.phone),
      },
    });
  });
});
