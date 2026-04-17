import { test } from '@playwright/test';
import { runApiCase } from '../../utils/api.response.helper.js';

test.describe('API SPEC: viewApplications', () => {
  test('viewApplications', async ({ request }, testInfo) => {
    await runApiCase(request, testInfo, 'viewApplications');
  });
});
