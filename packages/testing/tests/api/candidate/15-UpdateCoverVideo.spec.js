import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: UpdateCoverVideo', () => {
  test('UpdateCoverVideo', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'UpdateCoverVideo');
  });
});
