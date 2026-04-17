import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: currencyFilter', () => {
  test('currencyFilter', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'currencyFilter');
  });
});
