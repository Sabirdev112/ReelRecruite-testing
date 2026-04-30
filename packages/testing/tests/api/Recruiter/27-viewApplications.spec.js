import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: ViewApplications', () => {
  test('ViewApplications', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'viewApplications');
  });
});
