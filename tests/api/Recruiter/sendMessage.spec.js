import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: sendMessage', () => {
  test('sendMessage', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'sendMessage');
  });
});
