import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: regionFilter', () => {
  test('regionFilter', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'regionFilter');
  });
});
