import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: ForgetPassword', () => {
  test('ForgetPassword', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'ForgetPassword');
  });
});
