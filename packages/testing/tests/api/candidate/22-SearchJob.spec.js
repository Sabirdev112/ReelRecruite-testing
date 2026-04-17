import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: SearchJob', () => {
  test('SearchJob', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'SearchJob');
  });
});
