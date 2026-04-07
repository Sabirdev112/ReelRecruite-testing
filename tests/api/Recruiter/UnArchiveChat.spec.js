import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: UnArchiveChat', () => {
  test('UnArchiveChat', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'UnArchiveChat');
  });
});
