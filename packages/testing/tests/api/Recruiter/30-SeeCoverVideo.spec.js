import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: SeeCoverVideo', () => {
  test('SeeCoverVideo', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'SeeCoverVideo');
  });
});
