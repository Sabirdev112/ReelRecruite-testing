import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: UpdateResume', () => {
  test('UpdateResume', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'UpdateResume');
  });
});
