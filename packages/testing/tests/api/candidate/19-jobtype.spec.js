import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: jobtype', () => {
  test('jobtype', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'jobtype');
  });
});
