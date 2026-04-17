import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: experienceLevelFilter', () => {
  test('experienceLevelFilter', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'experienceLevelFilter');
  });
});
