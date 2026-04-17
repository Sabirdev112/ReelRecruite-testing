import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: withdrawApplication', () => {
  test('withdrawApplication', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'withdrawApplication');
  });
});
