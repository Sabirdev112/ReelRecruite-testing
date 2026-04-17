import { test } from '@playwright/test';
import { runApiCase } from '../utils/api.response.helper.js';

test.describe('API SPEC: Login', () => {
  test('Login', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'Login');
  });
});
