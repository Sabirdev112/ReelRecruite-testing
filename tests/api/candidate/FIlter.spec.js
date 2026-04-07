import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: FIlter', () => {
  test('FIlter', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'FIlter');
  });
});
