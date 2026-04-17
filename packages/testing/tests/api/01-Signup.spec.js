import { test } from '@playwright/test';
import { runApiCase, createSignupUser } from '../utils/api.response.helper.js';
import { storeNewUser, toSignupApiPhone } from '../utils/signupCredentials.helper.js';

test.describe('API SPEC: Signup', () => {
  test('Signup', async ({ request }, testInfo) => {
    const user = createSignupUser();
    await runApiCase(request, testInfo, 'Signup', {
      placeholderOverrides: {
        '{{signup.phone}}': toSignupApiPhone(user.phone),
      },
    });
    storeNewUser(user);
  });
});
