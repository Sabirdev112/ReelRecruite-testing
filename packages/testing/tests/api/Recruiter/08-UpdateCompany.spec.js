import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: UpdateCompany', () => {
  test('UpdateCompany', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'UpdateCompany');
  });
});
