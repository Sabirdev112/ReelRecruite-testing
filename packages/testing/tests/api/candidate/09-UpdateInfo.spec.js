import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: UpdateInfo', () => {
  test('UpdateInfo', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'UpdateInfo');
  });
});
