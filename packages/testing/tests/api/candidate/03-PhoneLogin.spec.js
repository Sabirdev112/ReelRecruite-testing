import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: PhoneLogin', () => {
  test('PhoneLogin', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'PhoneLogin');
  });
});
