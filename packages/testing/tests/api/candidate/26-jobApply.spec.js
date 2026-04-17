import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: jobApply', () => {
  test('jobApply', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'jobApply');
  });
});
