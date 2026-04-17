import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: ChangePassword', () => {
  test('ChangePassword', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'ChangePassword');
  });
});
